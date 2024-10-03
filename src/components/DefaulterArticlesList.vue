<template>
    <ul class="articles-list">
        <li v-for="({unit_price, quantity, name}, indexArticle) in articles" :key="indexArticle" class="articles-list-item" :class="unit_price > 0 ? 'debt_balance' : 'discount_balance'">
            <span class="price-detail-tag">${{unit_price * quantity}} {{name}}</span>
            <button class="edit-tag" @click="$emit('handleEditArticle', indexArticle)">
                <i class='bx bx-edit bx-sm'></i>
            </button>
            <button class="delete-tag" @click="$emit('handleDeleteArticle', indexArticle)">
                <i class='bx bx-trash bx-sm'></i>
            </button>
        </li>
    </ul>
</template>

<script setup>
    const props = defineProps({
        articles: Array,
    })
</script>

<style scoped>
.articles-list{
  min-height: 30vh;
  max-height: 40vh;
  background-color: var(--grey);
  border-radius: 25px;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  overflow-y: auto;
}

.articles-list-item{
  font: normal normal normal 1.3rem var(--default-font);
  display: flex;
  align-items: center;
  gap: .2rem;
}
.price-detail-tag{}
.edit-tag,
.delete-tag{
    color: var(--color-titles);
}
</style>