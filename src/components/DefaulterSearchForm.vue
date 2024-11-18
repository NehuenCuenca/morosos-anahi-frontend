<template>
    <form class="search-defaulter-form" @click.once="handleClickInputElement" @submit.prevent="handleSubmit">
        <div class="search-defaulter-input-container">
            <input list="defaulter-names" v-model="nameFromInput" class="search-defaulter-form__input" name="Nombre_moroso" placeholder="Buscar por nombre">
            <datalist id="defaulter-names"> 
                <option v-for="({name}) in suggestedNames" :value="name"></option>
            </datalist>
            <button type="submit" class="search-defaulter-form__submit-button" title="Buscar moroso">
                <i class='bx bx-search-alt-2 bx-md'></i>
            </button>
        </div>
        <span class="validation-error-msg"></span>
    </form>
</template>

<script setup>
    import { computed, ref } from 'vue';
    import useApiRequests from '../composables/useAPIRequests';
    import useCustomForm from '../composables/useCustomForm';

    const emits = defineEmits(['handle-submit-search-defaulter'])

    const defaultersNames = ref([])
    const nameFromInput = ref('')

    const { getAllDefaulters } = useApiRequests()

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
        const formElement = event.target
        const { getInputValuesSanitized, hasFalsyInputValues, showRequiredInputsValidationError, showValidationError, cleanValidationError } = useCustomForm(formElement)
        cleanValidationError()

        const sanitizedInputs = getInputValuesSanitized()
        const { boolean: hasFalsyInputs, falsyInputs } = hasFalsyInputValues(sanitizedInputs)
        if( hasFalsyInputs ){
            showRequiredInputsValidationError(falsyInputs)
            return
        }

        const { Nombre_moroso } = sanitizedInputs
        const defaulterFound = defaultersNames.value.find(({name}) => name === Nombre_moroso);

        if( !defaulterFound ){
            showValidationError(`El moroso '${Nombre_moroso}' NO ESTA REGISTRADO, revise de nuevo el nombre ingresado.`) 
            return
        }

        emits('handle-submit-search-defaulter', { defaulterId: defaulterFound.id })        
    }
</script>

<style scoped>
.search-defaulter-form{
  /* max-width: 25%; */
  display: flex;
  flex-direction: column;
  align-items: center;
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

.validation-error-msg{
    text-align: center;
    text-decoration: underline;
    font: normal normal 600 1.4rem var(--default-font);
    color: var(--debt_balance);
    width: clamp(300px, 80%, 380px);
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

@media (width >= 678px) {
    .search-defaulter-form__input{
        font: normal normal normal 2.2rem var(--display-font);
    }

    .search-defaulter-form__input::placeholder{
        font: normal normal normal 2.2rem var(--display-font);
    }


    .validation-error-msg{
        font: normal normal 600 1.8rem var(--default-font);
    }
}
@media (width >= 1280px) {
    .search-defaulter-form__input{
        font: normal normal normal 1.9rem var(--display-font);
    }

    .search-defaulter-form__input::placeholder{
        font: normal normal normal 1.9rem var(--display-font);
    }
    .validation-error-msg{
        font: normal normal 600 1.6rem var(--default-font);
    }
}
</style>