<template>
  <form class="defaulter-form" ref="rootFormElement" @submit.prevent="handleSubmit">
    <div class="field">
      <label for="input-defaulter-name" class="field__label">Nombre de moroso</label>
      <input type="text" list="defaulter-names" id="input-defaulter-name" :value="copyAfterSubmit?.Nombre_moroso || defaulterInfo?.name"
        class="name-defaulter-input" name="Nombre_moroso" placeholder="Un nombre o apodo">
      <datalist id="defaulter-names" v-if="defaultersNames.length > 0"> 
        <option v-for="({name}) in defaultersNames" :value="name"></option>
      </datalist>
    </div>

    <div class="field">
      <label for="input-price-quantity-detail" class="field__label">Precio unitario | Cantidad | Detalle</label>
      <input type="text" :value="copyAfterSubmit?.Precio_Cantidad_Detalle || thingInfo?.pivot.unit_price_quantity_detail" class="field__input"
        id="input-price-quantity-detail" name="Precio_Cantidad_Detalle" placeholder="Ejemplo: 900|cig o 900|2|cig">
    </div>

    <div class="field">
      <label for="input-datetime" class="field__label">Fecha</label>
      <input type="datetime-local" step="1" :value="copyAfterSubmit?.Fecha_retiro || thingInfo?.pivot.retired_at || todayFormatedDate" class="field__input"
        id="input-datetime" name="Fecha_retiro">
    </div>

    <div class="field">
      <label for="input-was-paid" class="field__label">¿Pagó?</label>
      <input type="checkbox" :checked="!!thingInfo?.pivot.was_paid || false" class="field__input_checkbox" id="input-was-paid"
        name="Fue_pagado">
    </div>

    <div class="defaulter-form__buttons">
      <button type="button" @click="resetThingsFields" class="button-reset-thing" title="Limpiar">Limpiar item</button>
      <button type="submit" class="submit-new-defaulter-button" title="Guardar">Guardar</button>
    </div>
    <span class="validation-error-msg"></span>
  </form>
</template>

<script setup>
  import { nextTick, onMounted, ref } from 'vue';
  import { useToast } from "vue-toastification";
  import useApiRequests from '../composables/useAPIRequests.js';
  import useCustomForm from '../composables/useCustomForm.js'
  import { getTodayDateFormated } from '../helpers/Dates.js';

  const emits = defineEmits(['handle-submit-form', 'handle-clean-thing'])

  const props = defineProps({
    defaulterInfo: Object,
    thingInfo: Object
  })

  const rootFormElement = ref(null)
  const validationError = ref('')
  const copyAfterSubmit = ref(null)
  const defaultersNames = ref([])
  const todayFormatedDate = ref('')

  const { createOrUpdateDebt, getAllDefaulters, getAllThings } = useApiRequests()
  const toast = useToast();


  onMounted( async() => {
    if(!props.thingInfo) { setTodayOnDateInput() }
    await loadDefaultersNames()

    const currentCRUDOperation = rootFormElement.value.getAttribute('data-CRUD')
    if( currentCRUDOperation === 'C' ){
      rootFormElement.value.querySelector('input#input-defaulter-name').focus()
    } else {
      rootFormElement.value.querySelector('input#input-price-quantity-detail').focus()
    } 
  })

  const resetAfterSubmit = () => {
    validationError.value = ''
    copyAfterSubmit.value = null
  }

  const setTodayOnDateInput = () => { 
    const today = getTodayDateFormated()
    todayFormatedDate.value = today
  }

  const handleSubmit = async(event) => { 
    const formElement = event.target
    const currentCRUDOperation = formElement.getAttribute('data-CRUD')
    
    const { getInputValuesSanitized, hasFalsyInputValues, showRequiredInputsValidationError, cleanValidationError, matchPriceQuantityDetailFormat, showValidationError } = useCustomForm(formElement)
    cleanValidationError()

    const sanitizedInputs = getInputValuesSanitized()
    const { boolean: hasFalsyInputs, falsyInputs } = hasFalsyInputValues(sanitizedInputs)
    if( hasFalsyInputs ){
      showRequiredInputsValidationError(falsyInputs)
      reFillForm(sanitizedInputs)
      return
    }

    if( !matchPriceQuantityDetailFormat(sanitizedInputs.Precio_Cantidad_Detalle) ){
      showValidationError(`El campo 'Precio unitario | Cantidad | Detalle' NO RESPETA el respectivo formato`)
      return
    }
    
    if( currentCRUDOperation === 'C' ){
      await createDebt(sanitizedInputs)
    } else {
      await updateDebt(sanitizedInputs)
    }    

    setTodayOnDateInput()
    rootFormElement.value.querySelector('input#input-price-quantity-detail').focus()
  }

  const patchPriceQuantityDetailString = (priceQuantityDetail) => { 
    let [newPrice, newQuantity, newDetail] = priceQuantityDetail.split('|')
    if(!newDetail) [newDetail, newQuantity] = [newQuantity, newDetail];
    
    const quantityIsEmptyOrIsNaN = ( !newQuantity || Number.isNaN(newQuantity) )
    return { 
      newPrice: parseInt(newPrice),
      newQuantity: (quantityIsEmptyOrIsNaN) ? 1 : parseInt(newQuantity),
      newDetail: newDetail.trim()
    }
  }

  const createDebt = async(newDebt) => { 
    console.log('createDebt | GUARDAR MOROSO (C)', newDebt);

    const { newPrice, newQuantity, newDetail } = patchPriceQuantityDetailString(newDebt.Precio_Cantidad_Detalle)
  
    const suitableFieldsToSend = { 
      defaulter_name: newDebt.Nombre_moroso,
      thing: {
        unit_price: newPrice,
        quantity: newQuantity,
        thing_name: newDetail,
        retired_at: newDebt.Fecha_retiro,
        filed_at: null,
        was_paid: (newDebt?.Fue_pagado) ? true : false
      }
    }

    const newDebtResponse = await createOrUpdateDebt(-1, suitableFieldsToSend)
    console.log(newDebtResponse);
    const responseIsGood = newDebtResponse.statusText === 'OK'
    if (!responseIsGood) {
      const errorMessage = `Error al tratar de guardar una nueva deuda: ${newDebtResponse?.response?.data.message} ${newDebtResponse.message}.`
      console.error(errorMessage)
      toast.error(
        errorMessage, { 
        position: "bottom-right", timeout: 5000, closeOnClick: false, pauseOnFocusLoss: true, pauseOnHover: true, draggable: true, draggablePercent: 0.6, showCloseButtonOnHover: false, hideProgressBar: true, closeButton: "button", icon: true, rtl: false
      });
      return
    }

    toast.success(
      newDebtResponse.data.message, { 
      position: "bottom-right", timeout: 5000, closeOnClick: true, pauseOnFocusLoss: true, pauseOnHover: true, draggable: true, draggablePercent: 0.6, showCloseButtonOnHover: false, hideProgressBar: true, closeButton: "button", icon: true, rtl: false
    });
    emits('handle-submit-form', { responseIsGood, defaulter: newDebtResponse.data.defaulter })
    resetAfterSubmit()
    return
  }

  const updateDebt = async(debtToUpdate) => { 
    console.log('updateDebt | EDITAR MOROSO (RU)', debtToUpdate);
    const selectedAThingToEdit = !!props.thingInfo
    
    if( !selectedAThingToEdit ) {
      createDebt(debtToUpdate)
      return
    }

    const { newPrice, newQuantity, newDetail } = patchPriceQuantityDetailString(debtToUpdate.Precio_Cantidad_Detalle)

    const suitableFieldsToSend = { 
      unit_price: newPrice,
      quantity: newQuantity,
      retired_at: debtToUpdate.Fecha_retiro,
      filed_at: props.thingInfo.pivot.filed_at,
      was_paid: (debtToUpdate?.Fue_pagado) ? true : false
    }

    const wantsToEditDefaulterName = debtToUpdate.Nombre_moroso !== props.defaulterInfo.name
    const wantsToEditThingName = selectedAThingToEdit && (newDetail !== props.thingInfo.name)
    if( wantsToEditDefaulterName ) { suitableFieldsToSend.new_defaulter_name = debtToUpdate.Nombre_moroso }
    if( wantsToEditThingName ) { suitableFieldsToSend.new_thing_name = newDetail }

    const updatedDebtResponse = await createOrUpdateDebt(props.thingInfo.pivot.id, suitableFieldsToSend)
    console.log(updatedDebtResponse);
    const responseIsGood = updatedDebtResponse.statusText === 'OK'
    if (!responseIsGood) {
      const errorMessage = `Error al tratar de editar una nueva deuda: ${updatedDebtResponse?.response?.data.message} (${updatedDebtResponse.message}).`
      console.error(errorMessage)
      toast.error(
        errorMessage, { 
        position: "bottom-right", timeout: 5000, closeOnClick: false, pauseOnFocusLoss: true, pauseOnHover: true, draggable: true, draggablePercent: 0.6, showCloseButtonOnHover: false, hideProgressBar: true, closeButton: "button", icon: true, rtl: false
      });
      return
    }

    toast.success(
      `El moroso '${updatedDebtResponse.data.defaulter.name}' ha sido EDITADO exitosamente.`, { 
      position: "bottom-right", timeout: 5000, closeOnClick: true, pauseOnFocusLoss: true, pauseOnHover: true, draggable: true, draggablePercent: 0.6, showCloseButtonOnHover: false, hideProgressBar: true, closeButton: "button", icon: true, rtl: false
    });
    emits('handle-submit-form', { responseIsGood, defaulter: updatedDebtResponse.data.defaulter })
    resetAfterSubmit()
    return
  }

  const reFillForm = (sanitizedInputs) => { 
    copyAfterSubmit.value = { ...sanitizedInputs }
    if(!props.thingInfo){ setTodayOnDateInput()}
  }

  const resetThingsFields = (event) => {
    emits('handle-clean-thing')
    validationError.value = ``
    copyAfterSubmit.value = (copyAfterSubmit.value) ? { Nombre_moroso: copyAfterSubmit?.value.Nombre_moroso } : null
    const defaulterNameInput = rootFormElement.value.querySelector('.name-defaulter-input')

    const nameBeforeReset = defaulterNameInput.value
    rootFormElement.value.reset()

    defaulterNameInput.value = nameBeforeReset || ''

    nextTick(() => { setTodayOnDateInput() })
  }

  const loadDefaultersNames = async() => { 
    const defaultersPromise = await getAllDefaulters({ orderByAlphabet: true })
    const { data } = defaultersPromise.data.defaulters
    defaultersNames.value = data.map(({id, name}) => ({ id, name: name.toLowerCase() }))
  }
</script>

<style scoped>
.name-defaulter-input,
.field__input {
  background-color: var(--input-text-bg);
  border-radius: 25px;
  padding: .5rem 1rem;
  color: var(--color-bg);
  font: normal normal normal 1.3rem var(--default-font);
  box-shadow: 4px 4px 10px 2px rgba(0, 0, 0, 0.5);
  border: none;
  outline: none;
}

.defaulter-form {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.7rem 1.5rem;
  padding: 0;
}

.name-defaulter-input {
  /* font: normal normal normal 1.2rem var(--display-font); */
  grid-area: input-name;
}

.field {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: .2rem 0;
}

.field__label {
  font: normal normal normal 1.4rem var(--display-font);
  line-height: 1.7rem;
}

.field__input_checkbox {
  accent-color: var(--color-font);
  border-radius: inherit;
  box-shadow: inherit;
  width: 1.5rem;
  height: 1.5rem;
}

.defaulter-form__buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.submit-new-defaulter-button {
  background-color: var(--color-titles);
  border-radius: 25px;
  color: var(--color-bg);
  font: normal normal normal 1.5rem var(--display-font);
  height: min-content;
  padding: .5rem 1rem;
  place-self: center;
}

.button-reset-thing {
  background-color: transparent;
  border-radius: 25px;
  border: 2px solid var(--color-font);
  color: var(--color-titles);
  font: normal normal normal 1.3rem var(--display-font);
  height: min-content;
  padding: .5rem .7rem;
  width: min-content;
}

.validation-error-msg {
  font: normal normal normal 1.3rem var(--display-font);
  color: var(--debt_balance);
  text-decoration: underline;
  text-underline-offset: 5px;
  animation: FadeInCenter 1s ease 0s 1 normal forwards;
}

.field:has(#input-unit-price), .field:has(#input-quantity-product) {
  width: clamp(120px, 45%, 260px);
}

/* .field:has([type="datetime-local"]) {} */

.field:has([for="input-was-paid"]) {
  width: clamp(120px, 50%, 260px);
  flex-direction: column;
  align-items: center;
  gap: .5rem;
}

.field:has([for="input-was-paid"]) .field__label {
  white-space: nowrap;
}

@keyframes FadeInCenter {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}

@media (width >= 768px) {
  .defaulter-form {
    /* margin: 0 auto; */
    justify-content: space-between;
    gap: 2.5rem 1.5rem;
  }

  .field__label {
    font: normal normal normal 2.2rem var(--display-font);
    line-height: 2.5rem;
  }

  .name-defaulter-input,
  .field__input {
    padding: .5rem 1rem;
    font: normal normal normal 2rem var(--default-font);
  }

  .field__input_checkbox {
    width: 2.5rem;
    height: 2.5rem;
  }

  .submit-new-defaulter-button {
    font: normal normal normal 2.3rem var(--display-font);
    width: 45%;
  }

  .button-reset-thing {
    font: normal normal normal 2rem var(--display-font);
    width: 45%;
  }

  .validation-error-msg {
    font: normal normal normal 2.2rem var(--display-font);
  }

  .field:has([type="datetime-local"]) {
    width: 65%;
  }

  .field:has([for="input-was-paid"]) {
    width: 25%;
  }

  .field:has([for="input-was-paid"]) {
    place-self: end;
  }

  .field:has([for="input-was-paid"]) .field__label {
    white-space: nowrap;
  }
}


@media (width >= 1280px) {
  .defaulter-form {
    width: clamp(500px, 45%, 600px);
    justify-content: space-between;
    gap: 2.5rem 1.5rem;
  }

  .field__label {
    font: normal normal normal 2rem var(--display-font);
    line-height: 2.5rem;
  }

  .name-defaulter-input,
  .field__input {
    padding: .5rem 1rem;
    font: normal normal normal 1.8rem var(--default-font);
  }

  .field__input_checkbox {
    width: 2rem;
    height: 2rem;
  }

  .submit-new-defaulter-button {
    font: normal normal normal 2rem var(--display-font);
  }

  .button-reset-thing {
    font: normal normal normal 1.8rem var(--display-font);
  }

  .validation-error-msg {
    font: normal normal normal 2.2rem var(--display-font);
  }

  .field:has([type="datetime-local"]) {
    width: 70%;
  }

  .field:has([for="input-was-paid"]) {
    width: 25%;
    place-self: end;
  }

  .field:has([for="input-was-paid"]) .field__label {
    white-space: nowrap;
  }
}

@media (width >= 1300px) {
  .defaulter-form {
    gap: 1.5rem;
  }

  .field__label {
    font: normal normal normal 1.5rem var(--display-font);
    line-height: 2.5rem;
  }

  .name-defaulter-input,
  .field__input {
    padding: .5rem 1rem;
    font: normal normal normal 1.4rem var(--default-font);
    /* font: normal normal normal 1.3rem var(--display-font); */
  }

  .field__input_checkbox {
    width: 1.5rem;
    height: 1.5rem;
  }

  .submit-new-defaulter-button {
    font: normal normal normal 1.6rem var(--display-font);
  }

  .button-reset-thing {
    font: normal normal normal 1.4rem var(--display-font);
  }

  .validation-error-msg {
    font: normal normal normal 2rem var(--display-font);
  }
}
</style>