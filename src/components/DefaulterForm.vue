<template>
    <form class="defaulter-form">
        <input type="text" :value="defaulterName" name="name-defaulter" class="name-defaulter-input" placeholder="Nombre de moroso">
        
        <div class="field">
          <label for="input-unit-price" class="field__label">Precio unitario</label>
          <input type="number" :value="articleInfo?.unit_price" class="field__input" id="input-unit-price" name="unit-price" required placeholder="Costo por unidad">
        </div>

        <div class="field">
          <label for="input-quantity-product" class="field__label">Cantidad</label>
          <input type="number" :value="articleInfo?.quantity" class="field__input" id="input-quantity-product" name="quantity" min="0" required placeholder="Cantidad de productos">
        </div>

        <div class="field">
          <label for="input-detail" class="field__label">Razón o detalle</label>
          <input type="text" :value="articleInfo?.name" class="field__input" id="input-detail" name="detail" required minlength="3" maxlength="40" placeholder="Nombre de producto">
        </div>

        <div class="field">
          <label for="input-datetime" class="field__label">Fecha</label>
          <input type="date" class="field__input" id="input-datetime" name="datetime" required>
        </div>

        <button type="submit" class="submit-new-defaulter-button" title="Guardar">Guardar</button>
    </form>
</template>

<script setup>
  const props = defineProps({
    defaulterName: String,
    articleInfo: Object
  })
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
    "input-price input-quantity ."
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


.field:has([for="input-unit-price"]){ grid-area: input-price;}
.field:has([for="input-quantity-product"]){ grid-area: input-quantity;}
.field:has([for="input-detail"]){ grid-area: input-detail;}
.field:has([for="input-datetime"]){ grid-area: input-date;}

</style>