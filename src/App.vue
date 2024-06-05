<script setup>
  import Navbar from './components/Navbar.vue';

</script>

<template>
  <section class="principal-container">
    <header class="principal-container__header">
      <Navbar />
    </header>
    <main class="principal-container__content">
      <h1>Main title</h1>
    </main>
  </section>
</template>

<style scoped>

.principal-container{
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: minmax(50px, 250px) 1fr;
  justify-items: start;
}

.principal-container > * {
  height: 100vh;
}

.principal-container__header{
  position: relative;
  width: min-content;
  background-color: var(--beige);
  z-index: 1;
}


.principal-container__header:has(.navbar_open){
  border-radius: 0 25px 25px 0;
  animation: myAnim .3s ease 0s 1 normal forwards;
}

.principal-container__header:has(.navbar_open) + .principal-container__content{
  background-color: var(--modal-fade-bg);
  pointer-events: none;
}


.principal-container__content{
  margin-left: 50px;
  position: absolute;
  width: calc(100% - 50px);
}

@keyframes myAnim {
	0% {
		opacity: 0;
		transform: translateX(-250px);
	}

	100% {
		opacity: 1;
		transform: translateX(0);
	}
}
</style>
