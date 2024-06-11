<template>
    <ul class="defaulters-list">
        <li v-for="item in 12" class="defaulters-list-item">
          <button type="button" class="defaulters-list-item__button">
            <span class="defaulter-name">Nombre moroso</span>  
            <span class="defaulter-balance" 
                  :class="item % 2 == 0 ? 'positive-balance' : 'negative-balance'">
              $300
            </span>
          </button>
        </li>
    </ul>
</template>

<script setup>

</script>

<style  scoped>
.defaulters-list{
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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