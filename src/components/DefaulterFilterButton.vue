<template>
    <button class="filters-by__filter-button" 
        :class="(isActive) ? 'filters-by__filter-button_active':''">
        {{caption}}
    </button>
</template>

<script setup>
    const props = defineProps({
        caption: String,
        isActive: Boolean,
    })
</script>

<style scoped>

</style>