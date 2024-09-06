<template>
    <h2 v-if="defaulters.length === 0">No hay morosos 🥳</h2>
    <ul v-else class="defaulters-list">
        <li v-for="({name, balances}, index) in defaulters" :key="index" class="defaulters-list-item">
          <button type="button" @click="(event) => handleViewDefaulter(index, event)" class="defaulters-list-item__button">
            <span class="defaulter-name">{{name}}</span>  
            <span class="defaulter-balance" 
                  :class="balances.positive > balances.negative 
                          ? 'positive-balance' 
                          : 'negative-balance'">
              ${{balances.total}}
            </span>
          </button>
        </li>
    </ul>
    <Modal v-if="isModalOpen && defaulterInfo" @handle-close-modal="closeModal">
      <DefaulterForm :defaulterName="defaulterInfo.name" :articleInfo="defaulterArticleSelected"/>
      <div class="divider-modal"></div>
      <DefaulterArticlesList :articles="defaulterArticles" @handle-edit-article="handleEditArticle" @handle-delete-article="handleDeleteArticle"/>
      <DefaulterBalancesList :balances="defaulterInfo.balances"/>
    </Modal>
</template>

<script setup>
import { ref } from 'vue';
import Modal from './Modal.vue';
import DefaulterForm from './DefaulterForm.vue';
import DefaulterArticlesList from './DefaulterArticlesList.vue';
import DefaulterBalancesList from './DefaulterBalancesList.vue';
import useDefaulters from '../composables/useDefaulters';

const { getDefaulterInfoById } = useDefaulters()

const props = defineProps({
  defaulters: Array,
})

const defaulterInfo = ref(null)
const defaulterArticles = ref([])
const defaulterArticleSelected = ref(null)
const isModalOpen = ref(false)
const closeModal = () => { 
  isModalOpen.value = false
}

const handleViewDefaulter = async(defaulterIndex, event) => { 
  isModalOpen.value = true
  defaulterInfo.value = await getDefaulterInfoById(defaulterIndex)
  const { negative_items, positive_items } = defaulterInfo.value
  defaulterArticles.value = [...negative_items, ...positive_items]
  console.log(defaulterArticles.value);
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
</script>

<style  scoped>
.defaulters-list{
  height: min-content;
  overflow-y: auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: min-content;
  gap: 1rem;
}
.defaulters-list-item{
  border-radius: 15px;
  background-color: #D9D9D9;
}

.defaulters-list-item__button{
  padding: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.defaulter-name{
  font: normal normal normal 500 1.3rem var(--display-font);
  color: black;
}

.defaulter-balance{
  font: normal normal normal 500 1.3rem var(--default-font);
}

</style>