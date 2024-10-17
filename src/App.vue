<script setup>
  import DefaulterArticlesList from './components/DefaulterArticlesList.vue';
  import DefaulterBalancesList from './components/DefaulterBalancesList.vue';
  import DefaulterForm from './components/DefaulterForm.vue';
  import DefaultersFilters from './components/DefaultersFilters.vue';
  import DefaultersList from './components/DefaultersList.vue';
  import DefaultersPagination from './components/DefaultersPagination.vue';
  import Modal from './components/Modal.vue';
  import Navbar from './components/Navbar.vue';
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
  const defaulterArticles = ref([])
  const defaulterArticleSelected = ref(null)
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
    getItemsOfDefaulterById,
    deleteItem
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
    const { items, ...restInfo } = getDefaulterInfoResponse.data.defaulter
    defaulterInfo.value = restInfo
    defaulterArticles.value = items
  }

  const handleEditArticle = (indexArticleSelected) => { 
    console.log('EDIT executed', indexArticleSelected); 
    defaulterArticleSelected.value = defaulterArticles.value[indexArticleSelected]
  }

  const handleDeleteArticle = async(indexArticleSelected) => { 
    console.log('DELETE executed', indexArticleSelected); 
    const articleSelected = defaulterArticles.value[indexArticleSelected]
    const { name, quantity, unit_price, was_paid } = articleSelected
    const crossOutOrDebtText = (was_paid) ? 'VOLVER A ANOTAR' : 'TACHAR'
    const confirmDeleteArticle = confirm(`¿Esta seguro de ${crossOutOrDebtText} '${name} $${unit_price * quantity}'?`)

    if(!confirmDeleteArticle) return

    const deletedItemResponse = await deleteItem(articleSelected.id)
    const responseIsGood = deletedItemResponse.statusText === 'OK'
    if(!responseIsGood){
      const errorMessage = `Error al tratar de ${crossOutOrDebtText} el articulo ${name}: ${deletedItemResponse.message}. Intentalo de nuevo mas tarde.`
      console.error(errorMessage);
      alert(errorMessage);
      return
    }

    const { items, ...restInfo } = deletedItemResponse.data.defaulter
    defaulterInfo.value = restInfo
    defaulterArticles.value = items

    await setNewDefaulters(paramsUsedToGetDefaulters.value) // refresh defaulters
  }

  const cleanPreviousDefaulterInfo = () => { 
    defaulterInfo.value = null
    defaulterArticles.value = []
    defaulterArticleSelected.value = null
  }

  const updateLocalDefaulter = async({responseIsGood, defaulter}) => { 
    if( userAction.value === 'C' ) { 
      closeModal() 
      userAction.value = 'RU'
    }
    const { items, ...restInfo } = defaulter
    
    defaulterInfo.value = restInfo
    defaulterArticles.value = items

    await setNewDefaulters(paramsUsedToGetDefaulters.value) // refresh defaulters
  }

  const cleanArticleSelected = () => { 
    defaulterArticleSelected.value = null
  }
</script>

<template>
  <section class="principal-container">
    <!-- <header class="principal-container__header">
      <Navbar />
    </header> -->
    
    <main class="principal-container__content">
      <h1 class="content-title">Lista de morosos</h1>

      <div class="add-and-search">
        <button type="button" class="add-defaulter-button" @click="handleCreateDefaulter">
          <i class='bx bx-plus add-defaulter-button__icon bx-md'></i>
          <span class='add-defaulter-button__text'>Agregar moroso</span>
        </button>

        <Modal :userAction="userAction" v-if="userAction.includes('C')" @handle-close-modal="closeModal">
          <DefaulterForm :data-CRUD="userAction" :defaulterInfo="defaulterInfo" :articleInfo="null" @handle-submit-form="updateLocalDefaulter" @clean-article-selected="cleanArticleSelected"/>
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
        <DefaulterForm :data-CRUD="userAction" :defaulterInfo="defaulterInfo" :articleInfo="defaulterArticleSelected" @handle-submit-form="updateLocalDefaulter" @handle-clean-article="cleanArticleSelected"/>
        <div class="divider-modal"></div>
        <DefaulterArticlesList :articles="defaulterArticles" @handle-edit-article="handleEditArticle" @handle-delete-article="handleDeleteArticle"/>
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
  .add-defaulter-button{}
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
