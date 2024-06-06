<template>
    <div class="pagination">
        <button class="direction-button">Anterior</button>
        <button v-for="item in 5" class="page-button" :class="item === 3 ? ' page-button_active': ''">{{ item }}</button>
        <button class="direction-button">Siguiente</button>
    </div>
</template>

<script setup>

</script>

<style scoped>
.pagination{
  align-self: flex-start;
  font: normal normal normal 500 1.3rem var(--default-font);
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