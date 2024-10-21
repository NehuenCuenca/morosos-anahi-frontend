<script setup>
  import DefaulterThingsList from './components/DefaulterThingsList.vue';
  import DefaulterBalancesList from './components/DefaulterBalancesList.vue';
  import DefaulterForm from './components/DefaulterForm.vue';
  import DefaultersFilters from './components/DefaultersFilters.vue';
  import DefaultersList from './components/DefaultersList.vue';
  import DefaultersPagination from './components/DefaultersPagination.vue';
  import Modal from './components/Modal.vue';
  import { onMounted, ref, computed} from 'vue';
  import useDefaulters from './composables/useDefaulters';
  import DefaulterSearchForm from './components/DefaulterSearchForm.vue';

  const customPaginatedBy = 9

  const defaulters = ref([])
  const pagination = ref(null)
  const orderBy = ref({})
  const paramsUsedToGetDefaulters = ref({})
  
  const isModalOpen = ref(false)
  const defaulterInfo = ref(null)
  const defaulterThings = ref([])
  const defaulterThingSelected = ref(null)
  const userAction = ref('') // stands for one or more letters of CRUD operations 
  const isDoingCRUDOperations = computed(() => {
    return (userAction.value.length === 0) ? false :  
    userAction.value.split().some( initial => 'CRUD'.includes(initial))
  } ) 
  const errorWhenLoadAllDefaulters = ref({bool: false, message: ''})
  const errorWhenLoadSingleDefaulter = ref({bool: false, message: ''})
  
  const handleCreateDefaulter = (event) => { 
    userAction.value = 'C'.toUpperCase()
  }
  
  const handlePaginationUpdate = async(newPage) => {
    paramsUsedToGetDefaulters.value = { paginatedBy: customPaginatedBy, page: newPage, ...orderBy.value }
    await setNewDefaulters(paramsUsedToGetDefaulters.value)
  }

  const handleOrderUpdate = async(newOrder) => {
    if(!newOrder) {
      paramsUsedToGetDefaulters.value = { paginatedBy: customPaginatedBy, page: 1 }
      await setNewDefaulters(paramsUsedToGetDefaulters.value)
      return
    }

    orderBy.value = newOrder
    paramsUsedToGetDefaulters.value = { paginatedBy: customPaginatedBy, page: 1, ...newOrder }
    await setNewDefaulters(paramsUsedToGetDefaulters.value)
  }

  const closeModal = () => { 
    userAction.value = ''
    isModalOpen.value = false
    cleanPreviousDefaulterInfo()
  }

  const { 
    getAllDefaulters, 
    getDefaulterInfoById,
    deleteThing
  } = useDefaulters()

  onMounted( async() => {
    paramsUsedToGetDefaulters.value = { paginatedBy: customPaginatedBy, page: 1 }
    await setNewDefaulters(paramsUsedToGetDefaulters.value)
  })

  const setNewDefaulters = async({paginatedBy, page=1, orderByLastestRecent = false, orderByAlphabet = false, orderByLargestDebtor = false}) => { 
    const getAllDefaultersResponse = await getAllDefaulters({ paginatedBy, page, orderByLastestRecent, orderByAlphabet, orderByLargestDebtor, })
    const responseIsGood = getAllDefaultersResponse.statusText === 'OK'
    if(!responseIsGood){
      errorWhenLoadAllDefaulters.value = { bool: true, message: `Error al cargar los morosos: ${getAllDefaultersResponse.message}` }
      pagination.value = null
      defaulters.value = []
      return
    }

    const { data, ...paginationFields } = getAllDefaultersResponse.data.defaulters
    pagination.value = paginationFields
    defaulters.value = data
    errorWhenLoadAllDefaulters.value = { bool: false, message: '' }
  }

  const readOrUpdateDefaulter = async({ defaulterId }) => {
    cleanPreviousDefaulterInfo()

    userAction.value = 'RU'.toUpperCase()
    isModalOpen.value = true
    
    const getDefaulterInfoResponse = await getDefaulterInfoById(defaulterId)

    const responseIsGood = getDefaulterInfoResponse.statusText === 'OK'
    if( !responseIsGood  ){
      const errorMessage = `Error al traer la informacion del moroso y sus items: ${getDefaulterInfoResponse.message}. Intentalo de nuevo mas tarde.`
      console.error(errorMessage);
      alert(errorMessage);
      errorWhenLoadSingleDefaulter.value = { bool: true, message: errorMessage};
      closeModal()
      return
    }

    errorWhenLoadSingleDefaulter.value = { bool: false, message:`` };
    const { items, ...restInfo } = getDefaulterInfoResponse.data.defaulter //77
    defaulterInfo.value = restInfo
    defaulterThings.value = items //77
  }

  const handleEditThing = (indexThingSelected) => { 
    console.log('EDIT executed', indexThingSelected); 
    defaulterThingSelected.value = defaulterThings.value[indexThingSelected]
  }

  const handleDeleteThing = async(indexThingSelected) => { 
    console.log('DELETE executed', indexThingSelected); 
    const thingSelected = defaulterThings.value[indexThingSelected]
    const { name, quantity, unit_price, was_paid } = thingSelected
    const crossOutOrDebtText = (was_paid) ? 'VOLVER A ANOTAR' : 'TACHAR'
    const confirmDeleteThing = confirm(`¿Esta seguro de ${crossOutOrDebtText} '${name} $${unit_price * quantity}'?`)

    if(!confirmDeleteThing) return

    const deletedThingResponse = await deleteThing(thingSelected.id)
    const responseIsGood = deletedThingResponse.statusText === 'OK'
    if(!responseIsGood){
      const errorMessage = `Error al tratar de ${crossOutOrDebtText} el articulo ${name}: ${deletedThingResponse.message}. Intentalo de nuevo mas tarde.`
      console.error(errorMessage);
      alert(errorMessage);
      return
    }

    const { items, ...restInfo } = deletedThingResponse.data.defaulter //77
    defaulterInfo.value = restInfo
    defaulterThings.value = items //77

    await setNewDefaulters(paramsUsedToGetDefaulters.value) // refresh defaulters
  }

  const cleanPreviousDefaulterInfo = () => { 
    defaulterInfo.value = null
    defaulterThings.value = []
    defaulterThingSelected.value = null
  }

  const updateLocalDefaulter = async({responseIsGood, defaulter}) => { 
    if( userAction.value === 'C' ) { 
      closeModal() 
      userAction.value = 'RU'
    }
    const { items, ...restInfo } = defaulter //77
    
    defaulterInfo.value = restInfo
    defaulterThings.value = items //77

    await setNewDefaulters(paramsUsedToGetDefaulters.value) // refresh defaulters
  }

  const cleanThingSelected = () => { 
    defaulterThingSelected.value = null
  }
</script>

<template>
  <section class="principal-container">    
    <main class="principal-container__content">
      <h1 class="content-title">Lista de morosos</h1>

      <div class="add-and-search">
        <button type="button" class="add-defaulter-button" @click="handleCreateDefaulter">
          <i class='bx bx-plus add-defaulter-button__icon bx-md'></i>
          <span class='add-defaulter-button__text'>Agregar moroso</span>
        </button>

        <Modal :userAction="userAction" v-if="userAction.includes('C')" @handle-close-modal="closeModal">
          <DefaulterForm :data-CRUD="userAction" :defaulterInfo="defaulterInfo" :thingInfo="null" @handle-submit-form="updateLocalDefaulter" @clean-thing-selected="cleanThingSelected"/> <!-- 77 -->
        </Modal>

        <DefaulterSearchForm @handle-submit-search-defaulter="readOrUpdateDefaulter"/>
      </div>

      <DefaultersFilters @handle-order-update="handleOrderUpdate"/>
      
      <template v-if="!errorWhenLoadAllDefaulters.bool && defaulters.length > 0">
        <DefaultersList @handle-click-defaulter-list="readOrUpdateDefaulter" :defaulters="defaulters"/>
        <DefaultersPagination :pagination="pagination" @handle-pagination-update="handlePaginationUpdate"/>
      </template>
      <span class="msg-error-after-load" v-else>{{ errorWhenLoadAllDefaulters.message }}</span>

      <Modal :userAction="userAction" v-if="isDoingCRUDOperations && defaulterInfo && !errorWhenLoadSingleDefaulter.bool" @handle-close-modal="closeModal">
        <DefaulterForm :data-CRUD="userAction" :defaulterInfo="defaulterInfo" :thingInfo="defaulterThingSelected" @handle-submit-form="updateLocalDefaulter" @handle-clean-thing="cleanThingSelected"/> <!-- 77 -->
        <div class="divider-modal"></div>
        <DefaulterThingsList :things="defaulterThings" @handle-edit-thing="handleEditThing" @handle-delete-thing="handleDeleteThing"/> <!-- 77 -->
        <DefaulterBalancesList :debt_balance="defaulterInfo.debt_balance" :discount_balance="defaulterInfo.discount_balance" :total_balance="defaulterInfo.total_balance"/>
      </Modal>
    </main>
  </section>
</template>

<style>

body:has(.modal-container){
  overflow: hidden;
}

.principal-container{
  width: 100%;
}

.principal-container__content{
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.content-title{
  font: normal normal normal 2.5rem var(--display-font);
  color: var(--color-titles);
  margin: 0 0 auto 0;
}

.add-and-search{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.add-defaulter-button{
  background-color: var(--color-titles);
  border-radius: 25px;
  padding: 1rem .5rem;
  display: flex;
  gap: 5px;
  color: var(--color-bg);
  box-shadow: 4px 4px 10px 2px rgba(0, 0, 0, 0.5);
  align-items: center;
}
/* .add-defaulter-button__icon{} */

.add-defaulter-button__text{
  font: normal normal normal 1.5rem var(--display-font);
}

.divider-modal{
  height: 2px;
  width: 90%;
  background-color: var(--color-titles);
  border-radius: 10px;
  margin: 2rem auto;
}

.discount_balance{
  color: var(--discount_balance);
}
.debt_balance{
  color: var(--debt_balance);
}

.msg-error-after-load{
  font: normal normal 400 1.5rem var(--display-font);
  color: var(--debt_balance);
  border: 2px dashed var(--debt_balance);
  padding: .5rem;
  border-radius: 10px;
}

@media (width >= 768px) {
  .principal-container__content{
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
  }

  .content-title{
    font: normal normal normal 3.5rem var(--display-font);
  }

  .add-and-search{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
  }
  /* .add-defaulter-button{} */
  /* .add-defaulter-button__icon{} */

  .add-defaulter-button__text{
    font: normal normal normal 2.2rem var(--display-font);
  }

  .divider-modal{
    height: 2px;
    width: 90%;
    background-color: var(--color-titles);
    border-radius: 10px;
    margin: 2rem auto;
  }

  .msg-error-after-load{
    font: normal normal 400 1.5rem var(--display-font);
    border: 2px dashed var(--debt_balance);
    padding: .5rem;
    border-radius: 10px;
  }
}

@media (width >= 1280px) {
  .add-and-search{
    justify-content: space-around;
  }
}
</style>
