<template>
    <div class="filters-by">
        <span>Ordenar por:</span>
        <button class="filters-by__filter-button">Alfabeticamente</button>
        <span>-</span>
        <button class="filters-by__filter-button filters-by__filter-button_active">Mas reciente</button>
    </div>
</template>

<script setup>

</script>

<style scoped>
.filters-by{
  align-self: flex-start;
  font: normal normal normal 500 1.3rem var(--display-font);
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