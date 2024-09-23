<template>
    <h2 v-if="defaulters.length === 0">No hay morosos 🥳</h2>
    <ul v-else class="defaulters-list">
        <li v-for="({id, name, total_balance}, index) in defaulters" :key="index" class="defaulters-list-item">
          <button type="button" @click="(event) => handleViewDefaulter(id, event)" class="defaulters-list-item__button">
            <span class="defaulter-name">{{name}}</span>  
            <span class="defaulter-balance" 
                  :class="total_balance > 0 
                          ? 'debt_balance' 
                          : 'discount_balance'">
              ${{total_balance}}
            </span>
          </button>
        </li>
    </ul>
</template>

<script setup>

  const props = defineProps({
    defaulters: Array,
  })

  const emits = defineEmits(['handle-open-modal'])

  const handleViewDefaulter = async(defaulterId, event) => {  
    emits('handle-open-modal', { defaulterId })
  }
</script>

<style  scoped>
.defaulters-list{
  height: min-content;
  overflow-y: auto;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: min-content;
  gap: 1rem;
}
.defaulters-list-item{
  border-radius: 15px;
  background-color: #D9D9D9;
}

.defaulters-list-item__button{
  padding: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.defaulter-name{
  font: normal normal normal 500 1.3rem var(--display-font);
  color: black;
}

.defaulter-balance{
  font: normal normal normal 500 1.3rem var(--default-font);
}

</style>