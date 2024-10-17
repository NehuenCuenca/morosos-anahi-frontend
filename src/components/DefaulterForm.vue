<template>
  <form class="defaulter-form" ref="rootFormElement" @submit.prevent="handleSubmit">
    <div class="field">
      <label for="input-defaulter-name" class="field__label">Nombre de moroso</label>
      <input type="text" id="input-defaulter-name" :value="copyAfterSubmit?.Nombre_moroso || defaulterInfo?.name"
        class="name-defaulter-input" name="Nombre_moroso" placeholder="Un nombre o apodo">
    </div>

    <div class="field">
      <label for="input-unit-price" class="field__label">Precio unitario</label>
      <input type="number" :value="copyAfterSubmit?.Precio_por_unidad || articleInfo?.unit_price" class="field__input"
        id="input-unit-price" name="Precio_por_unidad" placeholder="Costo por unidad">
    </div>

    <div class="field">
      <label for="input-quantity-product" class="field__label">Cantidad</label>
      <input type="number" :value="copyAfterSubmit?.Cantidad || articleInfo?.quantity || 1" class="field__input"
        id="input-quantity-product" name="Cantidad" min="0" placeholder="Cantidad de productos">
    </div>

    <div class="field">
      <label for="input-detail" class="field__label">Detalle</label>
      <input type="text" :value="copyAfterSubmit?.Detalle || articleInfo?.name" class="field__input" id="input-detail"
        name="Detalle" minlength="3" maxlength="40" placeholder="Nombre de producto">
    </div>

    <div class="field">
      <label for="input-datetime" class="field__label">Fecha</label>
      <input type="date" :value="copyAfterSubmit?.Fecha_retiro || articleInfo?.retirement_date" class="field__input"
        id="input-datetime" name="Fecha_retiro">
    </div>

    <div class="field">
      <label for="input-was-paid" class="field__label">¿Lo pagó?</label>
      <input type="checkbox" :checked="articleInfo?.was_paid || false" class="field__input_checkbox" id="input-was-paid"
        name="Fue_pagado">
    </div>

    <button type="button" @click="resetItemsFields" class="button-reset-item" title="Limpiar">Limpiar item</button>
    <button type="submit" class="submit-new-defaulter-button" title="Guardar">Guardar</button>
    <span v-if="validationError.length > 0" class="validation-error-msg">{{ validationError }}</span>
  </form>
</template>

<script setup>
  import { ref, onMounted, nextTick, onUpdated } from 'vue';
  import useDefaulters from '../composables/useDefaulters';
  import { formatDate } from '../helpers/Dates.js';

  const emits = defineEmits(['handle-submit-form', 'handle-clean-article'])

  const props = defineProps({
    defaulterInfo: Object,
    articleInfo: Object
  })

  const rootFormElement = ref(null)
  const validationError = ref('')
  const copyAfterSubmit = ref(null)

  const { createOrUpdateDefaulter, createOrUpdateItem } = useDefaulters()

  onMounted(() => {
    if(!props.articleInfo) { setTodayOnDateInput() }
  })

  onUpdated(() => {
    if(!props.articleInfo) { setTodayOnDateInput() }
  })

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
      Detalle: Detalle.trim() ,
      Fecha_retiro ,
      // Fue_pagado: (Fue_pagado === 'on') ? true : false // not required
    }

    const keyNamesOfFields = Object.keys(sanitizedFields)
    const falsyFields = Object.values(sanitizedFields).map( (val, index) => !val && keyNamesOfFields[index]).filter(val => val)

    const suitableFieldsToSend = { 
      name: sanitizedFields.Nombre_moroso,
      items: [{
        unit_price: sanitizedFields.Precio_por_unidad,
        quantity: sanitizedFields.Cantidad,
        name: sanitizedFields.Detalle,
        retirement_date: sanitizedFields.Fecha_retiro,
        was_paid: (Fue_pagado === 'on') ? true : false
      }]
    }    

    if( currentCRUDOperation === 'C' ){  // 1ER CASO: GUARDAR MOROSO (C)
      if (falsyFields.length > 0) { 
        showValidationErrors(falsyFields) 
        reFillForm(sanitizedFields)
        return
      }

      console.log('GUARDAR MOROSO (C)', suitableFieldsToSend);
      const newDefaulterResponse = await createOrUpdateDefaulter(-1, suitableFieldsToSend)
      console.log(newDefaulterResponse);
      const responseIsGood = newDefaulterResponse.statusText === 'OK'
      if (!responseIsGood) {
        const errorMessage = `Error al tratar de guardar un nuevo moroso: ${newDefaulterResponse.message}.`
        console.error(errorMessage)
        alert(errorMessage)
        return
      }

      emits('handle-submit-form', { responseIsGood, defaulter: newDefaulterResponse.data.defaulter })
      return
    }

    if (currentCRUDOperation.includes('U')) {
      if (
          suitableFieldsToSend.name !== props.defaulterInfo.name 
          && suitableFieldsToSend.name.length > 0 
        ) { // 2DO CASO: EDITAR MOROSO (RU)

        console.log('EDITAR MOROSO (RU)');
        const updatedDefaulterResponse = await createOrUpdateDefaulter(props.defaulterInfo.id, suitableFieldsToSend)
        const responseIsGood = updatedDefaulterResponse.statusText === 'OK'
        if (!responseIsGood) {
          const errorMessage = `Error al tratar de editar un nuevo moroso: ${updatedDefaulterResponse.message}.`
          console.error(errorMessage)
          alert(errorMessage)
          return
        }

        emits('handle-submit-form', { responseIsGood, defaulter: updatedDefaulterResponse.data.defaulter })
        resetItemsFields()
        return
      }

      if (!props.articleInfo) { // 3ER CASO: GUARDAR ITEM (RU)
        if (falsyFields.length > 0) { 
          showValidationErrors(falsyFields) 
          reFillForm(sanitizedFields)
          return
        }

        console.log('GUARDAR ITEM (RU)');
        const newItemResponse = await createOrUpdateItem({
          'defaulter_id': props.defaulterInfo.id,
          'item_id': -1, ...suitableFieldsToSend.items[0]
        })
        const responseIsGood = newItemResponse.statusText === 'OK'
        if (!responseIsGood) {
          const errorMessage = `Error al tratar de guardar un nuevo articulo: ${newItemResponse.message}.`
          console.error(errorMessage)
          alert(errorMessage)
          return
        }

        emits('handle-submit-form', { responseIsGood, defaulter: newItemResponse.data.defaulter })
        resetItemsFields()
        return
      }

      if (falsyFields.length > 0) { 
        showValidationErrors(falsyFields) 
        reFillForm(sanitizedFields)
        return
      }

      // 4TO CASO: EDITAR ITEM (RU)
      console.log('EDITAR ITEM (RU)');
      const updatedItemResponse = await createOrUpdateItem({
        'defaulter_id': props.defaulterInfo.id,
        'item_id': props.articleInfo?.id,
        ...suitableFieldsToSend.items[0]
      })

      const responseIsGood = updatedItemResponse.statusText === 'OK'
      if (!responseIsGood) {
        const errorMessage = `Error al tratar de editar un articulo: ${updatedItemResponse.message}.`
        console.error(errorMessage)
        alert(errorMessage)
        return
      }

      emits('handle-submit-form', { responseIsGood, defaulter: updatedItemResponse.data.defaulter })
      resetItemsFields()
      return
    }
  }

  const showValidationErrors = (fieldsWithErrors) => { 
    const concatenatedFields = fieldsWithErrors.map(field => field.toUpperCase().replaceAll('_', ' ')).join(', ')
    console.error(`No se envió el formulario ya que hay campos obligatorios que estan vacios: ${concatenatedFields}.`)
    validationError.value = `Hay campos obligatorios que estan vacios: ${concatenatedFields}.`  
  }

  const reFillForm = (sanitizedFields) => { 
    copyAfterSubmit.value = { ...sanitizedFields }
    if(!props.articleInfo){ setTodayOnDateInput()}
  }


  const resetItemsFields = (event) => {
    emits('handle-clean-article')
    validationError.value = ``
    copyAfterSubmit.value = (copyAfterSubmit.value) ? { Nombre_moroso: copyAfterSubmit?.value.Nombre_moroso } : null
    const defaulterNameInput = rootFormElement.value.querySelector('.name-defaulter-input')
    const nameBeforeReset = defaulterNameInput.value
    rootFormElement.value.reset()

    defaulterNameInput.value = nameBeforeReset || ''

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

.button-reset-item {
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

  .button-reset-item {
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

  .button-reset-item {
    font: normal normal normal 1.6rem var(--display-font);
  }

  .validation-error-msg {
    font: normal normal normal 2rem var(--display-font);
  }
}
</style>