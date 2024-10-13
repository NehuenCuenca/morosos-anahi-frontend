<template>
    <form class="search-defaulter-form" @click.once="handleClickInputElement" @submit.prevent="handleSubmit">
        <div class="search-defaulter-input-container">
            <input list="defaulter-names" v-model="nameFromInput" class="search-defaulter-form__input" name="search-defaulter-input" placeholder="Buscar por nombre">
            <datalist id="defaulter-names"> 
                <option v-for="({name}) in suggestedNames" :value="name"></option>
            </datalist>
            <button type="submit" class="search-defaulter-form__submit-button" title="Buscar moroso">
                <i class='bx bx-search-alt-2 bx-md'></i>
            </button>
        </div>
        <span class="search-defaulter-form__validation-message">{{ validationError }}</span>
    </form>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import useDefaulters from '../composables/useDefaulters';

    const emits = defineEmits(['handle-submit-search-defaulter'])

    const defaultersNames = ref([])
    const nameFromInput = ref('')
    const validationError = ref('')

    const { getAllDefaulters } = useDefaulters()

    const handleClickInputElement = async(event) => { 
        const defaultersPromise = await getAllDefaulters({ orderByAlphabet: true })
        const { data } = defaultersPromise.data.defaulters
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
            console.warn(`El moroso '${nameFromInput.value}' NO ESTA REGISTRADO, revise de nuevo el nombre ingresado.`);
            validationError.value = `El moroso '${nameFromInput.value}' NO ESTA REGISTRADO, revise de nuevo el nombre ingresado.`
            return
        }

        validationError.value = ``
        emits('handle-submit-search-defaulter', { defaulterId: defaulterFound.id })        
    }
</script>

<style scoped>
.search-defaulter-form{
  max-width: 25%;
  display: flex;
  flex-direction: column;
  gap: .8rem;
}

.search-defaulter-input-container{
  position: relative;
  display: flex;
  align-items: center;
}
.search-defaulter-form__input {
  background-color: var(--input-text-bg);
  border-radius: 25px;
  padding: .5rem 1rem;
  color: var(--color-bg);
  box-shadow: 4px 4px 10px 2px rgba(0, 0, 0, 0.5);
  border: none;
  outline: none;
}

.search-defaulter-form__input{
  font: normal normal normal 1.5rem var(--display-font);
  position: relative;
}

.search-defaulter-form__input::placeholder{
  font: normal normal normal 1.5rem var(--display-font);
  color: whitesmoke;
}

.search-defaulter-form__submit-button{
  color: whitesmoke;
  position: absolute;
  right: .5rem;
}

.search-defaulter-form__validation-message{
    text-decoration: underline;
    font: normal normal 600 1.15rem var(--default-font);
    color: var(--debt_balance);
}

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