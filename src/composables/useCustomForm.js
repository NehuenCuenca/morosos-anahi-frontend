import { ref } from 'vue'

const useCustomForm = ( formElement ) => {
  const validationErrorElement = ref(formElement.querySelector('.validation-error-msg'))

  const getInputValuesSanitized = () => {
    let inputsByNameAttribute = Object.fromEntries(new FormData(formElement))
    
    const sanitizedInputs = Object.entries(inputsByNameAttribute).reduce((acum, [key, value]) => {
      const typeOfInput = formElement.querySelector(`input[name="${key}"]`).type
      
      if( typeOfInput === 'text' ) {
        acum[key] = value.trim().toLowerCase()
        return acum
      }

      if( typeOfInput === 'number' ) {
        acum[key] = Number(value)
        return acum
      }

      if( typeOfInput === 'checkbox' ) {
        acum[key] = (value === 'on') ? true : false
        return acum
      }
    
      acum[key] = value
      return acum
    }, {})        

    return sanitizedInputs
  }

  const hasFalsyInputValues = (sanitizedInputs) => { 
    const keyNamesOfInputs = Object.keys(sanitizedInputs)
    const falsyInputs = Object.values(sanitizedInputs).map( (val, index) => !val && keyNamesOfInputs[index]).filter(val => val)

    return { 
      boolean: falsyInputs.length > 0,
      falsyInputs
    }
  }

  const matchPriceQuantityDetailFormat = (inputString) => { 
    const regex = /^-?[1-9]\d*\|(?:[1-9]\d*)?\|?[a-zA-Z\s]+$/;
    return regex.test(inputString);
  }

  const showRequiredInputsValidationError = (nameOfFalsyInputs) => { 
    const concatenatedFields = nameOfFalsyInputs.map(name => name.toUpperCase().replaceAll('_', ' ')).join(', ')
    console.error(`No se envió el formulario ya que hay campos obligatorios que estan vacios: ${concatenatedFields}.`)
    validationErrorElement.value.textContent = `Hay campos obligatorios que estan vacios: ${concatenatedFields}.`  
  }

  const showValidationError = (message) => { 
    console.error(message)
    validationErrorElement.value.textContent = message  
  }

  const cleanValidationError = () => { 
    validationErrorElement.value.textContent = ''  
  }

  return { getInputValuesSanitized, hasFalsyInputValues, showRequiredInputsValidationError, showValidationError, cleanValidationError, matchPriceQuantityDetailFormat }
}

export default useCustomForm;
