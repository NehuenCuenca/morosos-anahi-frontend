<template>
    <form class="search-defaulter-form" @click.once="handleClickInputElement" @submit.prevent="handleSubmit">
        <input list="defaulter-names" v-model="nameFromInput" class="search-defaulter-form__input" name="search-defaulter-input" placeholder="Buscar por nombre">
        <datalist id="defaulter-names"> 
            <option v-for="({name}) in suggestedNames" :value="name"></option>
        </datalist>
        <button type="submit" class="search-defaulter-form__submit-button" title="Buscar moroso">
            <i class='bx bx-search-alt-2 bx-md'></i>
        </button>
    </form>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import useDefaulters from '../composables/useDefaulters';

    const emits = defineEmits(['handle-open-modal'])

    const defaultersNames = ref([])
    const nameFromInput = ref('')

    const { getAllDefaulters } = useDefaulters()

    const handleClickInputElement = async(event) => { 
        const defaultersPromise = await getAllDefaulters({ orderByAlphabet: true })
        const { data } = defaultersPromise.defaulters
        defaultersNames.value = data.map(({id, name}) => ({ id, name: name.toLowerCase() }))
    }

    const suggestedNames = computed(() => { 
        const nameSanitized = nameFromInput.value.toLowerCase().trim()
        if(nameSanitized.length === 0) return []

        return defaultersNames.value.filter( ({name}) => name.startsWith(nameSanitized))
    })

    const handleSubmit = (event) => { 
        const defaulterFound = defaultersNames.value.find(({name}) => name === nameFromInput.value);

        if(!defaulterFound){
            console.warn(`El moroso '${nameFromInput.value}' no esta entre las sugerencias, revise de nuevo el nombre ingresado.`);
            alert(`El moroso '${nameFromInput.value}' no esta entre las sugerencias, revise de nuevo el nombre ingresado.`);
            return
        }

        emits('handle-open-modal', { defaulterId: defaulterFound.id })        
    }
</script>

<style scoped>
input::-webkit-calendar-picker-indicator {
    opacity: 0;
    display: none;
}

input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px var(--input-text-bg) inset !important;
    font: normal normal normal 1.5rem var(--display-font);
}
</style>