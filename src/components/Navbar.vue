<template>
    <nav ref="navbarElementRef" class="navbar">
        <button type="button" @click="handleMenu" title="Boton de menú" class="menu-button">
          <i v-if="!isMenuOpen" class='bx bx-menu bx-md'></i>
          <template v-else>
            <i class='bx bx-menu-alt-left bx-md menu-button__icon'></i>
            <span class="menu-button__text">Cerrar menú</span>
          </template>
        </button>
    </nav>
</template>

<script setup>
  import { ref } from 'vue';

  const navbarElementRef = ref(null)
  const isMenuOpen = ref(false)

  const handleMenu = (event) => { 
    isMenuOpen.value = !isMenuOpen.value
    navbarElementRef.value.classList.toggle('navbar_open')
  }
</script>

<style scoped>
.navbar{
  height: 100%;
  padding: 1rem .2rem 0 .2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.navbar_open{
  width: 250px;
}

.menu-button{
  color: var(--chocolate-dark);
  display: flex;
  align-items: center;
}

.menu-button__text{
  padding: 0 0 0 1rem;
  font: normal normal 500 1.5rem var(--display-font);
  word-break: break-word;
}
</style>