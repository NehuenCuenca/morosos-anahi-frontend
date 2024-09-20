<script setup>
  import DefaulterArticlesList from './components/DefaulterArticlesList.vue';
  import DefaulterBalancesList from './components/DefaulterBalancesList.vue';
  import DefaulterForm from './components/DefaulterForm.vue';
  import DefaultersFilters from './components/DefaultersFilters.vue';
  import DefaultersList from './components/DefaultersList.vue';
  import DefaultersPagination from './components/DefaultersPagination.vue';
  import Modal from './components/Modal.vue';
  import Navbar from './components/Navbar.vue';
  import { onMounted, ref} from 'vue';
  import useDefaulters from './composables/useDefaulters';


  const isCreatingDefaulter = ref(false)
  const defaulters = ref([])
  const pagination = ref(null)
  const orderBy = ref({})
  
  const handleCreateDefaulter = (event) => { 
    isCreatingDefaulter.value = true
  }
  
  const handlePaginationUpdate = async(newPage) => {
    await setNewDefaulters({ page: newPage, ...orderBy.value })
  }

  const handleOrderUpdate = async(newOrder) => {
    orderBy.value = newOrder
    await setNewDefaulters({paginatedBy: 12, page: 1, ...newOrder})
  }

  const closeModal = () => { 
    isCreatingDefaulter.value = false
  }

  const { getAllDefaulters } = useDefaulters()

  onMounted( async() => {
    await setNewDefaulters({
      paginatedBy: 12, 
      page: 1,
      orderByLastestRecent: false,
      orderByAlphabet: false
    })
  })

  const setNewDefaulters = async({paginatedBy=12, page=1, orderByLastestRecent = false, orderByAlphabet = false}) => { 
    const defaultersPromise = await getAllDefaulters({
      paginatedBy,
      page,
      orderByLastestRecent,
      orderByAlphabet,
    })

    const { data, ...paginationFields } = defaultersPromise.defaulters

    pagination.value = paginationFields
    defaulters.value = data
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

        <Modal v-if="isCreatingDefaulter" @handle-close-modal="closeModal">
          <DefaulterForm />
          <div class="divider-modal"></div>
          <DefaulterArticlesList />
          <DefaulterBalancesList :balances="{total: 0, positive: 0, negative: 0}"/>
        </Modal>

        <form class="search-defaulter-form">
          <input type="text" class="search-defaulter-form__input" name="search-defaulter-input" placeholder="Buscar por nombre">
          <button type="submit" class="search-defaulter-form__submit-button" title="Buscar moroso">
            <i class='bx bx-search-alt-2 bx-md'></i>
          </button>
        </form>
      </div>

      <DefaultersFilters :orderBy="orderBy" @handle-order-update="handleOrderUpdate"/>
      
      <template v-if="defaulters.length > 0">

        <DefaultersList :defaulters="defaulters"/>
        
        <DefaultersPagination 
        :pagination="pagination"
        @handle-pagination-update="handlePaginationUpdate"/>
      </template>
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
