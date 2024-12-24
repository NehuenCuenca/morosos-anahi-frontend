<template>
  <div class="filters-content">
    <h3 class="filters-indicator-text">Ordenar por:</h3>
    <ul class="filters-by-list">
        <li v-for="({caption, isActive}, indexFilter) in filters" :key="indexFilter">
          <DefaulterFilterButton 
            :caption="caption" 
            :is-active="isActive" 
            @click="setOrderBy(indexFilter)"
          />
        </li>
    </ul>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import DefaulterFilterButton from './DefaulterFilterButton.vue';

  const emits = defineEmits(['handle-order-update'])

  const filters = ref([
    {isActive: false, caption: "Alfabeticamente", paramName: 'orderByAlphabet'},
    {isActive: false, caption: "Mayor deudor", paramName: 'orderByLargestDebtor'},
    {isActive: false, caption: "Antigüedad", paramName: 'orderByOldestCreated'},
  ])

  const activeFilter = ref('')

  const setOrderBy = (clickedOrderIndex) => { 
    const currentFilter = filters.value.find(({ isActive }) => isActive)
    const clickedOrder = filters.value[clickedOrderIndex];

    if(currentFilter === clickedOrder) {
      currentFilter.isActive = false
      activeFilter.value = ''
      emits('handle-order-update', null)
      return
    }

    if(currentFilter) currentFilter.isActive = false
    clickedOrder.isActive = !clickedOrder.isActive
    activeFilter.value = clickedOrder.paramName

    emits('handle-order-update', {[clickedOrder.paramName]: clickedOrder.isActive})
  }
</script>

<style scoped>
.filters-content{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.filters-indicator-text{
  font: normal normal normal 500 1.5rem var(--display-font);
}
.filters-by-list{
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-self: center;
  gap: 1rem;
}
.filters-by__filter-button{
  font: normal normal normal 400 1.3rem var(--default-font);
  color: var(--color-font);
}
.filters-by__filter-button_active{
  text-decoration: underline;
  text-transform: uppercase;
}

@media (width >= 768px) {
  .filters-indicator-text{
    font: normal normal normal 500 2.2rem var(--display-font);
  }
  
  .filters-by-list{
    gap: 0;
    justify-content: space-between;
  }

  .filters-by__filter-button{
    font: normal normal normal 400 2rem var(--default-font);
  }
}
@media (width >= 1280px) {
  .filters-content{
    width: 95%;
  }
  
  .filters-by-list{
    align-self: start;
    justify-content: flex-start;
    gap: 2rem;
  }

  .filters-indicator-text{
    align-self: start;
    font: normal normal normal 500 1.7rem var(--display-font);
  }

  .filters-by__filter-button{
    font: normal normal normal 400 1.6rem var(--default-font);
  }
}
</style>