<template>
    <div class="filters-by">
        <span>Ordenar por:</span>
        <button @click="setOrderBy('orderByAlphabet')" 
          class="filters-by__filter-button" 
          :class="(orderName === 'orderByAlphabet' && orderValue)? 'filters-by__filter-button_active':''">
          Alfabeticamente
        </button>
        <span>-</span>
        <button @click="setOrderBy('orderByLastestRecent')" 
          class="filters-by__filter-button" 
          :class="(orderName === 'orderByLastestRecent' && orderValue)? 'filters-by__filter-button_active':''">
          Mas reciente
        </button>
        <span>-</span>
        <button @click="setOrderBy('orderByLargestDebtor')" 
          class="filters-by__filter-button" 
          :class="(orderName === 'orderByLargestDebtor' && orderValue)? 'filters-by__filter-button_active':''">
          Mayor deudor
        </button>
    </div>
</template>

<script setup>

import { computed } from 'vue';

  const props = defineProps({
    orderBy: Object,
  })
  const emits = defineEmits(['handle-order-update'])

  const setOrderBy = (orderType) => { 
    const toggleOrder = (orderName.value === orderType && orderValue.value)? false : true 
    emits('handle-order-update', {[orderType]: toggleOrder})
  }

  const orderName  = computed(() => Object.keys(props.orderBy)[0])
  const orderValue = computed(() => Object.values(props.orderBy)[0])
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