<template>
  <form class="defaulter-form" ref="rootFormElement" @submit.prevent="handleSubmit">
    <div class="field">
      <label for="input-defaulter-name" class="field__label">Nombre de moroso</label>
      <input type="text" id="input-defaulter-name" :value="copyAfterSubmit?.Nombre_moroso || defaulterInfo?.name"
        class="name-defaulter-input" name="Nombre_moroso" placeholder="Un nombre o apodo">
    </div>

    <div class="field">
      <label for="input-unit-price" class="field__label">Precio unitario</label>
      <input type="number" :value="copyAfterSubmit?.Precio_por_unidad || thingInfo?.pivot.unit_price" class="field__input"
        id="input-unit-price" name="Precio_por_unidad" placeholder="Costo por unidad">
    </div>

    <div class="field">
      <label for="input-quantity-product" class="field__label">Cantidad</label>
      <input type="number" :value="copyAfterSubmit?.Cantidad || thingInfo?.pivot.quantity || 1" class="field__input"
        id="input-quantity-product" name="Cantidad" min="0" placeholder="Cantidad de productos">
    </div>

    <div class="field">
      <label for="input-detail" class="field__label">Detalle</label>
      <input type="text" :value="copyAfterSubmit?.Detalle || thingInfo?.name" class="field__input" id="input-detail"
        name="Detalle" minlength="3" maxlength="40" placeholder="Nombre de producto">
    </div>

    <div class="field">
      <label for="input-datetime" class="field__label">Fecha</label>
      <input type="date" :value="copyAfterSubmit?.Fecha_retiro || thingInfo?.pivot.retired_at" class="field__input"
        id="input-datetime" name="Fecha_retiro">
    </div>

    <div class="field">
      <label for="input-was-paid" class="field__label">¿Lo pagó?</label>
      <input type="checkbox" :checked="!!thingInfo?.pivot.was_paid || false" class="field__input_checkbox" id="input-was-paid"
        name="Fue_pagado">
    </div>

    <button type="button" @click="resetThingsFields" class="button-reset-thing" title="Limpiar">Limpiar item</button>
    <button type="submit" class="submit-new-defaulter-button" title="Guardar">Guardar</button>
    <span v-if="validationError.length > 0" class="validation-error-msg">{{ validationError }}</span>
  </form>
</template>

<script setup>
  import { ref, onMounted, nextTick, onUpdated } from 'vue';
  import useDefaulters from '../composables/useDefaulters';
  import { formatDate } from '../helpers/Dates.js';

  const emits = defineEmits(['handle-submit-form', 'handle-clean-thing'])

  const props = defineProps({
    defaulterInfo: Object,
    thingInfo: Object
  })

  const rootFormElement = ref(null)
  const validationError = ref('')
  const copyAfterSubmit = ref(null)

  const { createOrUpdateDebt } = useDefaulters()

  onMounted(() => {
    if(!props.thingInfo) { setTodayOnDateInput() }
  })

  onUpdated(() => {
    if(!props.thingInfo) { setTodayOnDateInput() }
  })

  const resetAfterSubmit = () => {
    validationError.value = ''
    copyAfterSubmit.value = null
  }

  const setTodayOnDateInput = () => { 
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const retirementDateInput = rootFormElement.value.querySelector('#input-datetime')
    retirementDateInput.value = formatDate(today)
  }

  const handleSubmit = async(event) => { 
    const formElement = event.target
    const currentCRUDOperation = formElement.getAttribute('data-CRUD')

    const { Nombre_moroso, Precio_por_unidad, Cantidad, Detalle, Fecha_retiro, Fue_pagado } = Object.fromEntries(new FormData(formElement))

    const sanitizedFields = {
      Nombre_moroso: Nombre_moroso.trim(),
      Precio_por_unidad: Number(Precio_por_unidad),
      Cantidad: Number(Cantidad),
      Detalle: Detalle.trim(),
      Fecha_retiro ,
      // Fue_pagado: (Fue_pagado === 'on') ? true : false // not necessary to validate
    }

    const keyNamesOfFields = Object.keys(sanitizedFields)
    const falsyFields = Object.values(sanitizedFields).map( (val, index) => !val && keyNamesOfFields[index]).filter(val => val)

    if (falsyFields.length > 0) { 
      showValidationErrors(falsyFields) 
      reFillForm(sanitizedFields)
      return
    }

    sanitizedFields.Fue_pagado = (Fue_pagado === 'on') ? true : false

    if(currentCRUDOperation === 'C'){
      await createDebt(sanitizedFields)
    } else {
      await updateDebt(sanitizedFields)
    }
  }

  const createDebt = async(newDebt) => { 
    console.log('createDebt | GUARDAR MOROSO (C)', newDebt);

    const suitableFieldsToSend = { 
      defaulter_name: newDebt.Nombre_moroso,
      things: [{
        thing_name: newDebt.Detalle,
        unit_price: newDebt.Precio_por_unidad,
        quantity: newDebt.Cantidad,
        retired_at: newDebt.Fecha_retiro,
        filed_at: null, // REMINDER: CHANGE THIS WHEN THE FILED AT BUTTON IS ADDED
        was_paid: newDebt.Fue_pagado
      }]
    }

    const newDebtResponse = await createOrUpdateDebt(-1, suitableFieldsToSend)
    console.log(newDebtResponse);
    const responseIsGood = newDebtResponse.statusText === 'OK'
    if (!responseIsGood) {
      const errorMessage = `Error al tratar de guardar una nueva deuda: ${newDebtResponse?.response?.data.message} ${newDebtResponse.message}.`
      console.error(errorMessage)
      alert(errorMessage)
      return
    }

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

    const suitableFieldsToSend = { 
      unit_price: debtToUpdate.Precio_por_unidad,
      quantity: debtToUpdate.Cantidad,
      retired_at: debtToUpdate.Fecha_retiro,
      filed_at: null, // REMINDER: CHANGE THIS WHEN THE FILED AT BUTTON IS ADDED
      was_paid: debtToUpdate.Fue_pagado
    }

    const defaulterNameWasEdited = debtToUpdate.Nombre_moroso !== props.defaulterInfo.name
    const thingNameWasEdited = selectedAThingToEdit && (debtToUpdate.Detalle !== props.thingInfo.name)
    if(defaulterNameWasEdited) { suitableFieldsToSend.new_defaulter_name = debtToUpdate.Nombre_moroso }
    if(thingNameWasEdited) { suitableFieldsToSend.new_thing_name = debtToUpdate.Detalle }

    const updatedDebtResponse = await createOrUpdateDebt(props.thingInfo.pivot.id, suitableFieldsToSend)
    console.log(updatedDebtResponse);
    const responseIsGood = updatedDebtResponse.statusText === 'OK'
    if (!responseIsGood) {
      const errorMessage = `Error al tratar de guardar una nueva deuda: ${updatedDebtResponse?.response?.data.message} (${updatedDebtResponse.message}).`
      console.error(errorMessage)
      alert(errorMessage)
      return
    }

    emits('handle-submit-form', { responseIsGood, defaulter: updatedDebtResponse.data.defaulter })
    resetAfterSubmit()
    return
  }

  const showValidationErrors = (fieldsWithErrors) => { 
    const concatenatedFields = fieldsWithErrors.map(field => field.toUpperCase().replaceAll('_', ' ')).join(', ')
    console.error(`No se envió el formulario ya que hay campos obligatorios que estan vacios: ${concatenatedFields}.`)
    validationError.value = `Hay campos obligatorios que estan vacios: ${concatenatedFields}.`  
  }

  const reFillForm = (sanitizedFields) => { 
    copyAfterSubmit.value = { ...sanitizedFields }
    if(!props.thingInfo){ setTodayOnDateInput()}
  }


  const resetThingsFields = (event) => {
    emits('handle-clean-thing')
    validationError.value = ``
    copyAfterSubmit.value = (copyAfterSubmit.value) ? { Nombre_moroso: copyAfterSubmit?.value.Nombre_moroso } : null
    const defaulterNameInput = rootFormElement.value.querySelector('.name-defaulter-input')
    const quantityInput = rootFormElement.value.querySelector('#input-quantity-product')
    const nameBeforeReset = defaulterNameInput.value
    rootFormElement.value.reset()

    defaulterNameInput.value = nameBeforeReset || ''
    quantityInput.value = 1

    nextTick(() => { setTodayOnDateInput() })
  }
</script>

<style scoped>
.name-defaulter-input,
.field__input {
  background-color: var(--input-text-bg);
  border-radius: 25px;
  padding: .5rem 1rem;
  color: var(--color-bg);
  font: normal normal normal 1.3rem var(--display-font);
  box-shadow: 4px 4px 10px 2px rgba(0, 0, 0, 0.5);
  border: none;
  outline: none;
}

.defaulter-form {
  top: 2.5rem;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem 1.5rem;
  padding: 3rem 0 0 0;
}

.name-defaulter-input {
  font: normal normal normal 1.2rem var(--display-font);
  grid-area: input-name;
}

.field {
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: clamp(120px, 45%, 260px);
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
  width: 40%;
}

.validation-error-msg {
  font: normal normal normal 1.3rem var(--display-font);
  color: var(--debt_balance);
  text-decoration: underline;
  text-underline-offset: 5px;
}

.field:has([for="input-was-paid"]) {
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: .5rem;
}

.field:has([for="input-was-paid"]) .field__label {
  white-space: nowrap;
}

@media (width >= 768px) {
  .defaulter-form {
    margin: 0 auto;
    justify-content: space-around;
    gap: 2.5rem 1.5rem;
  }

  .field__label {
    font: normal normal normal 2.2rem var(--display-font);
    line-height: 2.5rem;
  }

  .name-defaulter-input,
  .field__input {
    padding: .5rem 1rem;
    font: normal normal normal 2rem var(--display-font);
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

  .field:has([for="input-was-paid"]) {
    place-self: end;
  }

  .field:has([for="input-was-paid"]) .field__label {
    white-space: nowrap;
  }
}


/* @media (width >= 1280px) {} */
@media (width >= 1300px) {

  .field{
    width: clamp(260px, 30%, 300px);
  }

  .field__label {
    font: normal normal normal 1.7rem var(--display-font);
    line-height: 2.5rem;
  }

  .name-defaulter-input,
  .field__input {
    padding: .5rem 1rem;
    font: normal normal normal 1.5rem var(--display-font);
  }

  .field__input_checkbox {
    width: 1.5rem;
    height: 1.5rem;
  }

  .submit-new-defaulter-button {
    font: normal normal normal 1.8rem var(--display-font);
  }

  .button-reset-thing {
    font: normal normal normal 1.6rem var(--display-font);
  }

  .validation-error-msg {
    font: normal normal normal 2rem var(--display-font);
  }
}
</style>