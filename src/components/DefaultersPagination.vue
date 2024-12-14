<template>
    <div class="pagination">
      <button v-if="pagination.current_page > 2" class="direction-button" @click="updatePage(1)" type="button">Primera</button>
      <div class="pagination__numbers">
        <button v-if="pagination.current_page > 1" class="page-button" @click="updatePage(pagination.current_page-1)" type="button">{{ pagination.current_page-1 }}</button>
        <button class="page-button page-button_active" @click="updatePage(pagination.current_page)" type="button">{{ pagination.current_page }}</button>
        <button v-if="pagination.current_page < pagination.last_page" class="page-button" @click="updatePage(pagination.current_page+1)" type="button">{{ pagination.current_page+1 }}</button>
      </div>
      <button v-if="pagination.current_page < (pagination.last_page-1)" class="direction-button" @click="updatePage(pagination.last_page)" type="button">Ultima</button>
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
  width: 95%;
  font: normal normal normal 500 1.3rem var(--default-font);
  display: flex;
  justify-content: space-between;
}

.pagination__numbers{
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  /* gap: .5rem; */
}

.direction-button,
.page-button{
  font: normal normal normal 500 1.5rem var(--default-font);
  color: var(--color-font);
}

.page-button_active{
  font: normal normal normal 700 2rem var(--default-font);
  text-decoration: underline;
}

.direction-button{
  text-transform: capitalize;
}

@media (width >= 768px) {
  .pagination{
    font: normal normal normal 500 2.5rem var(--default-font);
    gap: 2rem;
  }

  .pagination__numbers{
    justify-content: space-around;
  }

  .direction-button,
  .page-button{
    font: normal normal normal 500 2.5rem var(--default-font);
  }

  .page-button_active{
    font: normal normal normal 700 3rem var(--default-font);
  }

}

@media (width >= 1280px) {
  .pagination{
    justify-content: end;
  }

  .direction-button,
  .page-button{
    font: normal normal normal 500 2.2rem var(--default-font);
  }

  .page-button_active{
    font: normal normal normal 700 2.5rem var(--default-font);
  }

  .pagination__numbers{
    width: 15%;
    justify-content: space-around;
  }
}

@media (width >= 1300px) {
  .pagination{
    font: normal normal normal 500 2rem var(--default-font);
  }

  .pagination__numbers{
    justify-content: space-around;
  }

  .direction-button,
  .page-button{
    font: normal normal normal 500 1.7rem var(--default-font);
  }

  .page-button_active{
    font: normal normal normal 700 2rem var(--default-font);
  }
}
</style>