<template>
    <div class="modal-container">
        <div class="modal-content">
            <h1>Este es el MODAL</h1>
            <slot />
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.modal-container{
    position: absolute;
    top: 0;
    right: 0;
    z-index: 5;
    height: 100vh;
    width: 100vw;
    background-color: var(--modal-fade-bg);
    display: grid;
    place-items: center;
}
.modal-content{
    width: 50%;
    height: 50%;
    background-color: var(--color-bg);
    border-radius: 25px;
    color: var(--color-font);
}
</style>