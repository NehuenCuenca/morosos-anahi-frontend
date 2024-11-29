<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import { useToast } from "vue-toastification";
  import DefaulterBalancesList from './components/DefaulterBalancesList.vue';
  import DefaulterDebtsList from './components/DefaulterDebtsList.vue';
  import DefaulterForm from './components/DefaulterForm.vue';
  import DefaulterSearchForm from './components/DefaulterSearchForm.vue';
  import DefaultersFilters from './components/DefaultersFilters.vue';
  import DefaultersList from './components/DefaultersList.vue';
  import DefaultersPagination from './components/DefaultersPagination.vue';
  import Modal from './components/Modal.vue';
  import useApiRequests from './composables/useAPIRequests';
  import { getTodayDateFormated } from './helpers/Dates';

  const customPaginatedBy = 9

  const defaulters = ref([])
  const pagination = ref(null)
  const orderBy = ref({})
  const paramsUsedToGetDefaulters = ref({})
  
  const isModalOpen = ref(false)
  const defaulterInfo = ref(null)
  const defaulterDebts = ref([])
  const defaulterDebtSelected = ref(null)
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
  }

  const handleOrderUpdate = async(newOrder) => {
    if(!newOrder) {
      paramsUsedToGetDefaulters.value = { paginatedBy: customPaginatedBy, page: 1 }
      return
    }

    orderBy.value = newOrder
    paramsUsedToGetDefaulters.value = { paginatedBy: customPaginatedBy, page: 1, ...newOrder }
  }

  const closeModal = () => { 
    userAction.value = ''
    isModalOpen.value = false
    cleanPreviousDefaulterInfo()
  }

  const { 
    getAllDefaulters, 
    getDefaulterInfoById,
    createOrUpdateDebt,
    deleteModel
  } = useApiRequests()

  const toast = useToast();

  onMounted( async() => {
    paramsUsedToGetDefaulters.value = { paginatedBy: customPaginatedBy, page: 1 }
  })

  const setNewDefaulters = async({paginatedBy, page=1, orderByOldestCreated = false, orderByAlphabet = false, orderByLargestDebtor = false}) => { 
    const getAllDefaultersResponse = await getAllDefaulters({ paginatedBy, page, orderByOldestCreated, orderByAlphabet, orderByLargestDebtor })
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

  watch(paramsUsedToGetDefaulters, async (newParams, oldParams) => setNewDefaulters(newParams))

  const readOrUpdateDefaulter = async({ defaulterId }) => {
    cleanPreviousDefaulterInfo()

    userAction.value = 'RU'.toUpperCase()
    isModalOpen.value = true
    
    const getDefaulterInfoResponse = await getDefaulterInfoById(defaulterId)

    const responseIsGood = getDefaulterInfoResponse.statusText === 'OK'
    if( !responseIsGood  ){
      const errorMessage = `Error al traer la informacion del moroso y sus deudas: ${getDefaulterInfoResponse.message}. Intentalo de nuevo mas tarde.`
      console.error(errorMessage);
      toast.error(
        errorMessage, { 
        position: "bottom-right", timeout: 5000, closeOnClick: false, pauseOnFocusLoss: true, pauseOnHover: true, draggable: true, draggablePercent: 0.6, showCloseButtonOnHover: false, hideProgressBar: true, closeButton: "button", icon: true, rtl: false
      });
      errorWhenLoadSingleDefaulter.value = { bool: true, message: errorMessage};
      closeModal()
      return
    }

    errorWhenLoadSingleDefaulter.value = { bool: false, message:`` };
    const { debts_by_month_year, ...restInfo } = getDefaulterInfoResponse.data.defaulter 
    defaulterInfo.value = restInfo
    defaulterDebts.value = debts_by_month_year 
  }

  const handleEditDebt = async(debt_selected) => { 
    console.log('EDIT executed', debt_selected, ); 
    defaulterDebtSelected.value = debt_selected
  }

  const handleSoftDeleteDebt = async(debt_selected) => { 
    console.log('SOFT DELETE executed', debt_selected); 
    const { name } = debt_selected
    const { quantity, unit_price, was_paid } = debt_selected.pivot
    const crossOutOrDebtText = (was_paid) ? 'VOLVER A ANOTAR' : 'TACHAR'
    const confirmDeleteDebt = confirm(`¿Esta seguro de ${crossOutOrDebtText} '${name} $${unit_price * quantity}'?`)

    if(!confirmDeleteDebt) return

    const softDeletedDebtResponse = await createOrUpdateDebt(debt_selected.pivot.id, {was_paid: !was_paid})
    const responseIsGood = softDeletedDebtResponse.statusText === 'OK'
    if(!responseIsGood){
      const errorMessage = `Error al tratar de ${crossOutOrDebtText} la deuda ${name}: ${softDeletedDebtResponse.message}. Intentalo de nuevo mas tarde.`
      console.error(errorMessage);
      toast.error(
        errorMessage, { 
        position: "bottom-right", timeout: 5000, closeOnClick: false, pauseOnFocusLoss: true, pauseOnHover: true, draggable: true, draggablePercent: 0.6, showCloseButtonOnHover: false, hideProgressBar: true, closeButton: "button", icon: true, rtl: false
      });
      return
    }

    const { debts_by_month_year, ...restInfo } = softDeletedDebtResponse.data.defaulter
    defaulterInfo.value = restInfo
    defaulterDebts.value = debts_by_month_year

    await setNewDefaulters(paramsUsedToGetDefaulters.value) // refresh defaulters
  }

  const handleFileDebt = async(debt_selected) => { 
    console.log('FILE DEBT executed', debt_selected); 
    const { name } = debt_selected
    const { quantity, unit_price, filed_at } = debt_selected.pivot
    
    const toFileOrNot = (!filed_at) ? 'ARCHIVAR' : 'DESARCHIVAR'
    const filedAtValue = (!filed_at) ? getTodayDateFormated() : null
    const confirmFileDebt = confirm(`¿Esta seguro de ${toFileOrNot} '${name} $${unit_price * quantity}'?`)
    if(!confirmFileDebt) return

    const fileDebtResponse = await createOrUpdateDebt(debt_selected.pivot.id, {filed_at: filedAtValue})
    const responseIsGood = fileDebtResponse.statusText === 'OK'
    if(!responseIsGood){
      const errorMessage = `Error al tratar de ${toFileOrNot} la deuda ${name}: ${fileDebtResponse.message}. Intentalo de nuevo mas tarde.`
      console.error(errorMessage);
      toast.error(
        errorMessage, { 
        position: "bottom-right", timeout: 5000, closeOnClick: false, pauseOnFocusLoss: true, pauseOnHover: true, draggable: true, draggablePercent: 0.6, showCloseButtonOnHover: false, hideProgressBar: true, closeButton: "button", icon: true, rtl: false
      });
      return
    }

    const { debts_by_month_year, ...restInfo } = fileDebtResponse.data.defaulter
    defaulterInfo.value = restInfo
    defaulterDebts.value = debts_by_month_year

    await setNewDefaulters(paramsUsedToGetDefaulters.value) // refresh defaulters
  }

  const handleHardDeleteDebt = async(debt_selected) => { 
    console.log('HARD DELETE executed', debt_selected); 
    const { id, unit_price_quantity_detail } = debt_selected.pivot
    
    const hardDeleteDebtResponse = await deleteModel('debts', id)
    const responseIsGood = hardDeleteDebtResponse.statusText === 'OK'
    if(!responseIsGood){
      const errorMessage = `Error al tratar de borrar la deuda '${unit_price_quantity_detail}'': ${hardDeleteDebtResponse.message}. Intentalo de nuevo mas tarde.`
      console.error(errorMessage);
      toast.error(
        errorMessage, { 
        position: "bottom-right", timeout: 5000, closeOnClick: false, pauseOnFocusLoss: true, pauseOnHover: true, draggable: true, draggablePercent: 0.6, showCloseButtonOnHover: false, hideProgressBar: true, closeButton: "button", icon: true, rtl: false
      });
      return
    }

    toast.success(
      hardDeleteDebtResponse.data.message, { 
      position: "bottom-right", timeout: 5000, closeOnClick: false, pauseOnFocusLoss: true, pauseOnHover: true, draggable: true, draggablePercent: 0.6, showCloseButtonOnHover: false, hideProgressBar: true, closeButton: "button", icon: true, rtl: false
    });

    const { debts_by_month_year, ...restInfo } = hardDeleteDebtResponse.data.defaulter 
    defaulterInfo.value = restInfo
    defaulterDebts.value = debts_by_month_year
  }

  const cleanPreviousDefaulterInfo = () => { 
    defaulterInfo.value = null
    defaulterDebts.value = []
    defaulterDebtSelected.value = null
  }

  const updateLocalDefaulter = async({responseIsGood, defaulter}) => { 
    if( userAction.value === 'C' ) { 
      closeModal() 
      userAction.value = 'RU'
    }
    const { debts_by_month_year, ...restInfo } = defaulter 
    
    defaulterInfo.value = restInfo
    defaulterDebts.value = debts_by_month_year 
    cleanThingSelected()

    await setNewDefaulters(paramsUsedToGetDefaulters.value) // refresh defaulters
  }

  const cleanThingSelected = () => { 
    defaulterDebtSelected.value = null
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
          <DefaulterForm :data-CRUD="userAction" :defaulterInfo="defaulterInfo" :thingInfo="null" @handle-submit-form="updateLocalDefaulter" @clean-thing-selected="cleanThingSelected"/>
        </Modal>

        <DefaulterSearchForm @handle-submit-search-defaulter="readOrUpdateDefaulter"/>
      </div>

      <DefaultersFilters @handle-order-update="handleOrderUpdate"/>
      
      <template v-if="!errorWhenLoadAllDefaulters.bool && defaulters.length > 0">
        <DefaultersList @handle-click-defaulter-list="readOrUpdateDefaulter" :defaulters="defaulters"/>
        <DefaultersPagination :pagination="pagination" @handle-pagination-update="handlePaginationUpdate"/>
      </template>
      <span class="msg-error-after-load" v-else>{{ errorWhenLoadAllDefaulters.message }}</span>

      <Modal :userAction="userAction" v-if="isDoingCRUDOperations && defaulterInfo && !errorWhenLoadSingleDefaulter.bool" @handle-close-modal="closeModal" class="modal-w-form-and-list">
        <DefaulterForm :data-CRUD="userAction" :defaulterInfo="defaulterInfo" :thingInfo="defaulterDebtSelected" @handle-submit-form="updateLocalDefaulter" @handle-clean-thing="cleanThingSelected"/>
        <DefaulterDebtsList :debts="defaulterDebts" @handle-edit-debt="handleEditDebt" @handle-soft-delete-debt="handleSoftDeleteDebt" @handle-file-debt="handleFileDebt" @handle-hard-delete-debt="handleHardDeleteDebt"/>
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

  .msg-error-after-load{
    font: normal normal 400 1.5rem var(--display-font);
    border: 2px dashed var(--debt_balance);
    padding: .5rem;
    border-radius: 10px;
  }
}

@media (width >= 1280px) {
  #app{
    height: 100dvh;
  }

  .principal-container{
    height: 100dvh;
  }

  .principal-container__content{
    height: 100%;
    justify-content: space-between;
    gap: 0;
  }

  .content-title{
   font: normal normal normal 3.3rem var(--display-font);
  }

  .add-and-search{
    justify-content: space-around;
    font: normal normal normal 1.9rem var(--display-font);
  }

  .add-defaulter-button__text{
    font: normal normal normal 1.9rem var(--display-font);
  }
}
</style>
