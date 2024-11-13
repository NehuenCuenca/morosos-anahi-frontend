<template>
  <div class="filters-content">
    <h3 class="filters-indicator-text">Ordenar por:</h3>
    <ul class="filters-by-list">
        <li v-for="({paramName, caption}, indexFilter) in filters" :key="indexFilter">
          <DefaulterFilterButton 
            :caption="caption" 
            :is-active="activeFilter === paramName" 
            @click="setOrderBy(indexFilter)"
          />
        </li>
    </ul>
  </div>
</template>

<script setup>

  import DefaulterFilterButton from './DefaulterFilterButton.vue';
  import { ref } from 'vue';

  const emits = defineEmits(['handle-order-update'])

  const filters = ref([
    {bool: false, caption: "Alfabeticamente", paramName: 'orderByAlphabet'},
    {bool: false, caption: "Mayor deudor", paramName: 'orderByLargestDebtor'},
    {bool: false, caption: "Antigüedad", paramName: 'orderByOldestCreated'},
  ])

  const activeFilter = ref('')

  const setOrderBy = (clickedOrderIndex) => { 
    const currentFilter = filters.value.find(({ bool }) => bool)
    const clickedOrder = filters.value[clickedOrderIndex];

    if(currentFilter === clickedOrder) {
      currentFilter.bool = false
      activeFilter.value = ''
      emits('handle-order-update', null)
      return
    }

    if(currentFilter) currentFilter.bool = false
    clickedOrder.bool = !clickedOrder.bool
    activeFilter.value = clickedOrder.paramName

    emits('handle-order-update', {[clickedOrder.paramName]: clickedOrder.bool})
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