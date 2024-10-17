<template>
    <!-- <h2 v-if="defaulters.length === 0">No hay morosos 🥳</h2> -->
    <!-- <ul v-else class="defaulters-list"> -->
    <ul class="defaulters-list">
        <li v-for="({id, name, total_balance}, index) in defaulters" :key="index" class="defaulters-list-item">
          <button type="button" @click="(event) => handleViewDefaulter(id, event)" class="defaulters-list-item__button">
            <span class="defaulter-name">{{name}}</span>  
            <span class="defaulter-balance" 
                  :class="total_balance > 0 
                          ? 'debt_balance' 
                          : 'discount_balance'">
              ${{addThousandthPoint(total_balance)}}
            </span>
          </button>
        </li>
    </ul>
</template>

<script setup>
  import { addThousandthPoint } from '../helpers/Balances';

  const props = defineProps({
    defaulters: Array,
  })

  const emits = defineEmits(['handle-click-defaulter-list'])

  const handleViewDefaulter = async(defaulterId, event) => {  
    emits('handle-click-defaulter-list', { defaulterId })
  }
</script>

<style  scoped>
.defaulters-list{
  height: min-content;
  overflow-y: auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  /* grid-auto-rows: repeat(4, min-content); */
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
  width: 80%;
  font: normal normal normal 500 1.4rem var(--display-font);
  color: black;
  white-space: break-spaces;
  text-align: left;
}

.defaulter-balance{
  font: normal normal normal 500 1.3rem var(--default-font);
}

@media (width >= 768px) {
  .defaulters-list{
    width: 95%;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .defaulters-list-item__button{
    width: 100%;
    height: 100%;
  }

  .defaulter-name{
    width: 60%;
    font: normal normal normal 500 2rem var(--display-font);
    white-space: break-spaces;
  }

  .defaulter-balance{
    font: normal normal normal 500 2rem var(--default-font);
  }
}

@media (width >= 1280px) {
  .defaulters-list{
    width: 95%;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
  }
}
</style>