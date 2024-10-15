<template>
    <div class="filters-by">
        <span>Ordenar por:</span>
        <template v-for="({paramName, caption}, indexFilter) in filters" :key="indexFilter">
          <DefaulterFilterButton 
            :caption="caption" 
            :is-active="activeFilter === paramName" 
            @click="setOrderBy(indexFilter)"
          />
          <span v-if="indexFilter !== (filters.length-1)">-</span>
        </template>
    </div>
</template>

<script setup>

  import DefaulterFilterButton from './DefaulterFilterButton.vue';
  import { ref } from 'vue';

  const emits = defineEmits(['handle-order-update'])

  const filters = ref([
    {bool: false, caption: "Alfabeticamente", paramName: 'orderByAlphabet'},
    {bool: false, caption: "Mas reciente", paramName: 'orderByLastestRecent'},
    {bool: false, caption: "Mayor deudor", paramName: 'orderByLargestDebtor'},
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
.filters-by{
  align-self: flex-start;
  font: normal normal normal 500 1.3rem var(--display-font);
  display: flex;
  gap: .5rem;
}
.filters-by__filter-button{
  font: normal normal normal 400 1.2rem var(--default-font);
  color: var(--color-font);
}
.filters-by__filter-button_active{
  text-decoration: underline;
  text-transform: uppercase;
}
</style>