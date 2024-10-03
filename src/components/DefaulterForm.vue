<template>
    <form class="defaulter-form" ref="rootFormElement" @submit.prevent="handleSubmit">
        <input type="text" :value="defaulterInfo?.name" class="name-defaulter-input" name="name_defaulter" placeholder="Nombre de moroso">
        
        <div class="field">
          <label for="input-unit-price" class="field__label">Precio unitario</label>
          <input type="number" :value="articleInfo?.unit_price" class="field__input" id="input-unit-price" name="unit_price" placeholder="Costo por unidad">
        </div>

        <div class="field">
          <label for="input-quantity-product" class="field__label">Cantidad</label>
          <input type="number" :value="articleInfo?.quantity" class="field__input" id="input-quantity-product" name="quantity" min="0" placeholder="Cantidad de productos">
        </div>

        <div class="field">
          <label for="input-detail" class="field__label">Razón o detalle</label>
          <input type="text" :value="articleInfo?.name" class="field__input" id="input-detail" name="detail" minlength="3" maxlength="40" placeholder="Nombre de producto">
        </div>

        <div class="field">
          <label for="input-datetime" class="field__label">Fecha</label>
          <input type="date" :value="articleInfo?.retirement_date" class="field__input" id="input-datetime" name="datetime">
        </div>

        <button type="submit" class="submit-new-defaulter-button" title="Guardar">Guardar</button>
        <button type="button" @click="resetItemsFields" class="reset-item-button" title="Limpiar">Limpiar item</button>
    </form>
</template>

<script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import useDefaulters from '../composables/useDefaulters';
  import { formatDate } from '../helpers/Dates.js';

  const emits = defineEmits(['handle-submit-form', 'handle-clean-article'])

  const props = defineProps({
    defaulterInfo: Object,
    articleInfo: Object
  })

  const rootFormElement = ref(null)

  const { createOrUpdateDefaulter, createOrUpdateItem } = useDefaulters() 

  onMounted(() => {
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

    const { name_defaulter, unit_price, quantity, detail, datetime } = Object.fromEntries(new FormData(formElement))

    const fields = { 
      name: name_defaulter.trim(),
      items: [{
        unit_price: Number(unit_price),
        quantity: Number(quantity),
        name: detail.trim(),
        retirement_date: datetime,
        was_paid: false
      }]
    }
  
    // console.log(currentCRUDOperation, fields);

    if( currentCRUDOperation === 'C' ){  // 1ER CASO: GUARDAR MOROSO (C)
      console.log('GUARDAR MOROSO (C)');
      const newDefaulterResponse = await createOrUpdateDefaulter(-1, fields)
      console.log(newDefaulterResponse);
      const responseIsGood = newDefaulterResponse.statusText === 'OK'
      
      emits('handle-submit-form', {responseIsGood, defaulter: newDefaulterResponse.data.defaulter})
      return 
    }

    if( currentCRUDOperation.includes('U') ){ 
      if(fields.name !== props.defaulterInfo.name){ // 2DO CASO: EDITAR MOROSO (RU)
        console.log('EDITAR MOROSO (RU)');
        const updatedDefaulterResponse = await createOrUpdateDefaulter(props.defaulterInfo.id, fields)
        const responseIsGood = updatedDefaulterResponse.statusText === 'OK'

        emits('handle-submit-form', {responseIsGood, defaulter: updatedDefaulterResponse.data.defaulter})
        resetItemsFields()
        return 
      }

      if( !props.articleInfo ){ // 3ER CASO: GUARDAR ITEM (RU)
        console.log('GUARDAR ITEM (RU)');
        const newItemResponse = await createOrUpdateItem({ 
          'defaulter_id': props.defaulterInfo.id, 
          'item_id': -1, ...fields.items[0]
        })
        const responseIsGood = newItemResponse.statusText === 'OK'

        emits('handle-submit-form', {responseIsGood, defaulter: newItemResponse.data.defaulter})
        resetItemsFields()
        return 
      }

      // 4TO CASO: EDITAR ITEM (RU)
      console.log('EDITAR ITEM (RU)');
      const updatedItemResponse = await createOrUpdateItem({ 
        'defaulter_id': props.defaulterInfo.id,
        'item_id': props.articleInfo?.id,  
        ...fields.items[0] 
      })
      
      const responseIsGood = updatedItemResponse.statusText === 'OK'

      emits('handle-submit-form', {responseIsGood, defaulter: updatedItemResponse.data.defaulter})
      resetItemsFields()
      return 
    }

  }

  const resetItemsFields = (event) => { 
    emits('handle-clean-article')
    rootFormElement.value.reset()

    const defaulterNameInput = rootFormElement.value.querySelector('.name-defaulter-input')
    defaulterNameInput.value = props.defaulterInfo?.name || ''
    nextTick(() => { setTodayOnDateInput() })
  }
</script>

<style scoped >
.name-defaulter-input,
.field__input{
  background-color: var(--input-text-bg);
  border-radius: 25px;
  padding: .5rem 1rem;
  color: var(--color-bg);
  box-shadow: 4px 4px 10px 2px rgba(0, 0, 0, 0.5);
  border: none;
  outline: none;
}

.defaulter-form{
  width: 90%;
  display: grid;
  grid-template-areas: 
    "input-name . ."
    "input-price input-quantity reset-item-button"
    "input-detail input-date button-submit-form"
  ;
  gap: 1rem 0;
}
.name-defaulter-input{
  width: 80%;
  font: normal normal normal 1.2rem var(--display-font);
  grid-area: input-name;
}
.field{
  display: flex;
  flex-direction: column;
  width: 70%;
}
.field__label{
  font: normal normal normal 1.3rem var(--display-font);
}
.field__input{
  font: normal normal normal 1.1rem var(--display-font);
}
.submit-new-defaulter-button{ 
  grid-area: button-submit-form;
  background-color: var(--color-titles);
  border-radius: 25px;
  color: var(--color-bg);
  font: normal normal normal 1.3rem var(--display-font);
  height: min-content;
  padding: .5rem 1rem;
  place-self: end;
}
.reset-item-button{ 
  grid-area: reset-item-button;
  background-color: transparent;
  border-radius: 25px;
  border: 2px solid var(--color-font);
  color: var(--color-titles);
  font: normal normal normal 1.3rem var(--display-font);
  height: min-content;
  padding: .5rem 1rem;
  place-self: end;
}


.field:has([for="input-unit-price"]){ grid-area: input-price;}
.field:has([for="input-quantity-product"]){ grid-area: input-quantity;}
.field:has([for="input-detail"]){ grid-area: input-detail;}
.field:has([for="input-datetime"]){ grid-area: input-date;}

</style>