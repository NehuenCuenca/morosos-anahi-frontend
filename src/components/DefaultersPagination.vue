<template>
    <div class="pagination">
        <button class="direction-button" @click="updatePage(pagination.current_page-1)">Anterior</button>
        <button v-for="item in pagination.last_page" class="page-button" :class="item === pagination.current_page ? ' page-button_active': ''" @click="updatePage(item)">{{ item }}</button>
        <button class="direction-button" @click="updatePage(pagination.current_page+1)">Siguiente</button>
    </div>
</template>

<script setup>
const props = defineProps({
  pagination:  Object,
})

const emit = defineEmits(['handle-pagination-update'])

const updatePage = (newPage) => { 

  if( newPage <= 0 ||
      newPage > props.pagination.last_page ||
      newPage === props.pagination.current_page
  ) return

  emit('handle-pagination-update', newPage)
}
</script>

<style scoped>
.pagination{
  align-self: flex-start;
  font: normal normal normal 500 1.3rem var(--default-font);
  display: flex;
  gap: .5rem;
}
.direction-button,
.page-button{
  font: normal normal normal 500 1.3rem var(--default-font);
  color: var(--color-font);
}
.page-button_active{
  font: normal normal normal 700 1.6rem var(--default-font);
  text-decoration: underline;
}

.direction-button{
  text-transform: capitalize;
}
</style>