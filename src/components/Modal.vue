<template>
    <div class="modal-container">
        <div class="modal-window">
            <button type="button" class="close-modal-button" @click="$emit('handleCloseModal')">
                <i class='bx bx-x-circle bx-lg close-modal-button__icon'></i>
            </button>
            <div class="modal-content">
                <slot />
            </div>
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
.modal-window{
    /* width: 90%; */
    width: clamp(90vw, 100%, 95vw);
    min-height: 400px;
    max-height: 95%;
    padding: 1rem;
    background-color: var(--color-bg);
    border-radius: 25px;
    color: var(--color-font);
    position: relative;
    overflow-y: auto;
    display: grid;
    gap: .5rem 0;
    grid-template-areas: 
        "close-btn"
        "content-slot";
    justify-items: center;
}

.close-modal-button{
    grid-area: close-btn;
    margin: 0 0 auto auto;
}

.close-modal-button__icon{
    color: var(--color-font);   
}

.modal-content{
    grid-area: content-slot;
    /* width: 100%; */
    width: 95%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    row-gap: 1rem;
}

@media (width >= 1280px) {
    .modal-window{
        min-width: 50%;
        max-width: 90%;
    }

    .modal-window:has(form) {
        width: 50%;
    }

    .modal-window:has(form + ul) {
        width: 90%;
    }
}
</style>