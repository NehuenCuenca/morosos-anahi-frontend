<template>
    <div class="modal-container">
        <div class="modal-content">
            <button type="button" class="close-modal-button" @click="$emit('handleCloseModal')">
                <i class='bx bx-x-circle bx-lg close-modal-button__icon'></i>
            </button>
            <slot />
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.modal-container{
    position: fixed;
    top: 0;
    right: 0;
    z-index: var(--z-index-modal);
    height: 100vh;
    width: 100vw;
    background-color: var(--modal-fade-bg);
    display: grid;
    place-items: center;
}
.modal-content{
    width: 90%;
    min-height: 400px;
    max-height: 95%;
    padding: 1rem;
    background-color: var(--color-bg);
    border-radius: 25px;
    color: var(--color-font);
    position: relative;
    overflow-y: auto;
}

.close-modal-button{
    position: absolute;
    top: 1rem;
    right: 1rem;
}

.close-modal-button__icon{
    color: var(--color-font);   
}
</style>