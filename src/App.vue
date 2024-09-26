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


  const defaulters = ref([])
  const pagination = ref(null)
  const orderBy = ref({})
  
  const isModalOpen = ref(false)
  const defaulterInfo = ref(null)
  const defaulterArticles = ref([])
  const defaulterArticleSelected = ref(null)
  const userAction = ref('') // stands for one or more letters of CRUD operations 
  const isDoingCRUDOperations = computed(() => {
    return (userAction.value.length === 0) ? false :  
    userAction.value.split().some( initial => 'CRUD'.includes(initial))
  } ) 
  
  const handleCreateDefaulter = (event) => { 
    userAction.value = 'C'.toUpperCase()
  }
  
  const handlePaginationUpdate = async(newPage) => {
    await setNewDefaulters({ paginatedBy: 12, page: newPage, ...orderBy.value })
  }

  const handleOrderUpdate = async(newOrder) => {
    orderBy.value = newOrder
    await setNewDefaulters({ paginatedBy: 12, page: 1, ...newOrder })
  }

  const closeModal = () => { 
    userAction.value = ''
    isModalOpen.value = false
    cleanPreviousDefaulterInfo()
  }

  const { 
    getAllDefaulters, 
    getDefaulterInfoById,
    getItemsOfDefaulterById
  } = useDefaulters()

  onMounted( async() => {
    const resp = await setNewDefaulters({ paginatedBy: 12, page: 1 })
  })

  const setNewDefaulters = async({paginatedBy, page=1, orderByLastestRecent = false, orderByAlphabet = false, orderByLargestDebtor = false}) => { 
    const defaultersPromise = await getAllDefaulters({
      paginatedBy,
      page,
      orderByLastestRecent,
      orderByAlphabet,
      orderByLargestDebtor,
    })

    const { data, ...paginationFields } = defaultersPromise.defaulters

    pagination.value = paginationFields
    defaulters.value = data
  }

  const readOrUpdateDefaulter = async({ defaulterId }) => {
    cleanPreviousDefaulterInfo()

    userAction.value = 'RU'.toUpperCase()
    isModalOpen.value = true
    defaulterInfo.value = await getDefaulterInfoById(defaulterId)
    defaulterArticles.value = await getItemsOfDefaulterById(defaulterId)
  }

  const handleEditArticle = (indexArticleSelected) => { 
    console.log('EDIT executed', indexArticleSelected); 
    defaulterArticleSelected.value = defaulterArticles.value[indexArticleSelected]
  }

  const handleDeleteArticle = (indexArticleSelected) => { 
    console.log('DELETE executed', indexArticleSelected); 
    defaulterArticleSelected.value = defaulterArticles.value[indexArticleSelected]
    const confirmDeleteArtice = confirm(`¿Esta seguro de eliminar '${defaulterArticleSelected.value.item_name} $${defaulterArticleSelected.value.unit_price}'?`)

    if(confirmDeleteArtice) {
      defaulterArticles.value = defaulterArticles.value.toSpliced(indexArticleSelected, 1)
      defaulterArticleSelected.value = null
    }
  }

  const cleanPreviousDefaulterInfo = () => { 
    defaulterInfo.value = null
    defaulterArticles.value = []
    defaulterArticleSelected.value = null
  }
</script>

<template>
  <section class="principal-container">
    <header class="principal-container__header">
      <Navbar />
    </header>
    
    <main class="principal-container__content">
      <h1 class="content-title">Lista de morosos</h1>

      <div class="add-and-search">
        <button type="button" class="add-defaulter-button" @click="handleCreateDefaulter">
          <i class='bx bx-plus add-defaulter-button__icon bx-md'></i>
          <span class='add-defaulter-button__text'>Agregar moroso</span>
        </button>

        <Modal :userAction="userAction" v-if="userAction.includes('C')" @handle-close-modal="closeModal">
          <DefaulterForm />
          <div class="divider-modal"></div>
          <DefaulterArticlesList />
          <DefaulterBalancesList :debt_balance="0" :discount_balance="0" :total_balance="0"/>
        </Modal>

        <DefaulterSearchForm @handle-submit-search-defaulter="readOrUpdateDefaulter"/>
      </div>

      <DefaultersFilters :orderBy="orderBy" @handle-order-update="handleOrderUpdate"/>
      
      <template v-if="defaulters.length > 0">

        <DefaultersList @handle-click-defaulter-list="readOrUpdateDefaulter" :defaulters="defaulters"/>
        
        <DefaultersPagination :pagination="pagination" @handle-pagination-update="handlePaginationUpdate"/>
      </template>

      <Modal :userAction="userAction" v-if="isDoingCRUDOperations && defaulterInfo" @handle-close-modal="closeModal">
        <DefaulterForm :defaulterName="defaulterInfo.name" :articleInfo="defaulterArticleSelected"/>
        <div class="divider-modal"></div>
        <DefaulterArticlesList :articles="defaulterArticles" @handle-edit-article="handleEditArticle" @handle-delete-article="handleDeleteArticle"/>
        <DefaulterBalancesList :debt_balance="defaulterInfo.debt_balance" :discount_balance="defaulterInfo.discount_balance" :total_balance="defaulterInfo.total_balance"/>
      </Modal>
    </main>
  </section>
</template>

<style>

.principal-container{
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: minmax(50px, 250px) 1fr;
  justify-items: start;
}

.principal-container > * {
  height: 100vh;
}

.principal-container__header{
  position: relative;
  width: min-content;
  background-color: var(--beige);
  z-index: 1;
  padding: .5rem;
}


.principal-container__header:has(.navbar_open){
  border-radius: 0 25px 25px 0;
  animation: slideInLeft .3s ease 0s 1 normal forwards;
}

.principal-container__header:has(.navbar_open) + .principal-container__content{
  pointer-events: none;
  background-color: var(--modal-fade-bg);
  filter: blur(2px) brightness(0.4);
}


.principal-container__content{
  margin-left: 50px;
  padding: 1rem 1.5rem;
  position: absolute;
  width: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

@keyframes slideInLeft {
	0% {
		opacity: 0;
		transform: translateX(-250px);
	}

	100% {
		opacity: 1;
		transform: translateX(0);
	}
}

.content-title{
  font: normal normal normal 2.5rem var(--display-font);
  color: var(--color-titles);
  margin: 0 0 auto 0;
}

.add-and-search{
  width: 100%;
  display: flex;
  justify-content: space-between;
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

.search-defaulter-form{
  position: relative;
  display: flex;
  align-items: center;
}
.search-defaulter-form__input {
  background-color: var(--input-text-bg);
  border-radius: 25px;
  padding: .5rem 1rem;
  color: var(--color-bg);
  box-shadow: 4px 4px 10px 2px rgba(0, 0, 0, 0.5);
  border: none;
  outline: none;
}

.search-defaulter-form__input{
  font: normal normal normal 1.5rem var(--display-font);
  position: relative;
}

.search-defaulter-form__input::placeholder{
  font: normal normal normal 1.5rem var(--display-font);
  color: whitesmoke;
}

.search-defaulter-form__submit-button{
  color: whitesmoke;
  position: absolute;
  right: .5rem;
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
</style>
