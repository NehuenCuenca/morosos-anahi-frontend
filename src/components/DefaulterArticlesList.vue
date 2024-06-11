<template>
    <ul class="articles-list">
        <li class="articles-list-item positive-balance">
            <span class="price-detail-tag">$300 alfajor</span>
            <button class="edit-tag">
                <i class='bx bx-edit bx-sm'></i>
            </button>
            <button class="delete-tag">
                <i class='bx bx-trash bx-sm'></i>
            </button>
        </li>
        <li class="articles-list-item negative-balance">
            <span class="price-detail-tag">$600 alfajor</span>
            <button class="edit-tag">
                <i class='bx bx-edit bx-sm'></i>
            </button>
            <button class="delete-tag">
                <i class='bx bx-trash bx-sm'></i>
            </button>
        </li>
        <li class="articles-list-item negative-balance">
            <span class="price-detail-tag">$600 alfajor</span>
            <button class="edit-tag">
                <i class='bx bx-edit bx-sm'></i>
            </button>
            <button class="delete-tag">
                <i class='bx bx-trash bx-sm'></i>
            </button>
        </li>
        
    </ul>
</template>

<script setup>

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