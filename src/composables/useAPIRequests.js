import axios from "axios";
import useLoader from './useLoader'

const useApiRequests = () => {
    const LOCAL_URL = import.meta.env.VITE_LOCAL_URL
    
    const instance = axios.create({
      baseURL: `${LOCAL_URL}/api/`,
      timeout: 2500,
      headers: {
        'X-Custom-Header': 'foobar',
        'Accept': 'application/json'
      }
    });

    const loaderDefaultersList = useLoader({ isLoading: false, msgWhileLoading: 'Cargando la lista de morosos...', msgAfterLoading: '' })
    const loaderSingleDefaulter = useLoader({ isLoading: false, msgWhileLoading: 'Cargando balances y deudas del moroso', msgAfterLoading: '' })
    
    const getAllDefaulters = async(callParams) => {
      loaderDefaultersList.resetLoader()
      const { page, orderByAlphabet, orderByLargestDebtor, orderByOldestCreated } = callParams

      const wantsToOrderList = [orderByAlphabet,orderByLargestDebtor,orderByOldestCreated].some( v => !!v) && (page === 1)
      loaderDefaultersList.msgWhileLoading.value = (wantsToOrderList) ? 'Ordenando la lista...' : loaderDefaultersList.msgWhileLoading.value

      try {
        loaderDefaultersList.isLoading.value = true

        const response = await instance.get('/defaulters', {
          params: {
            ...callParams
          }
        });
        
        loaderDefaultersList.isLoading.value = false
        loaderDefaultersList.msgWhileLoading.value = ''
        return response
      } catch (error) {
        console.error("Error al intentar conseguir los morosos: ", error);

        loaderDefaultersList.isLoading.value = false
        loaderDefaultersList.msgWhileLoading.value = ''
        loaderDefaultersList.msgAfterLoading.value = 'Se rompió algo (hubo un error al intentar conseguir los morosos).'
        
        return error
      }
    };  

    const getAllThings = async(callParams) => {
      // const { paginatedBy, page, orderByAlphabet } = callParams
      try {
        const response = await instance.get('/things', {
          params: {
            ...callParams
          }
        });
        return response
      } catch (error) {
        console.error("Error al tratar de conseguir todos los productos registrados: ", error);
        return error
      }
    };   
    
    const getDefaulterInfoById = async(defaulterId) => { 
      loaderSingleDefaulter.resetLoader()
      try {
        loaderSingleDefaulter.isLoading.value = true
        
        const response = await instance.get(`/defaulters/${defaulterId}`);

        loaderSingleDefaulter.isLoading.value = false
        return response
      } catch (error) {
        console.error(`Error al tratar de conseguir el moroso (nro ${defaulterId}): `, error);

        loaderSingleDefaulter.isLoading.value = false
        loaderSingleDefaulter.msgWhileLoading.value = ''
        loaderSingleDefaulter.msgAfterLoading.value = `Se rompió algo (hubo un error al intentar conseguir los balances y deudas del moroso (nro ${defaulterId})`

        return error
      }
    }
    
    const getThingsOfDefaulterById = async(defaulterId) => { 
        try {
          const response = await instance.get(`/defaulters/${defaulterId}/things`); 
          return response
        } catch (error) {
          console.error(`Error al tratar de conseguir las deudas del moroso (nro ${defaulterId}): `, error);
          return error
        }
    }

    const createOrUpdateDefaulter = async(defaulterId, defaulterRecord) => {
      if(defaulterId === -1){ // when CREATING...
        try {
          const response = await instance.post('/defaulters', defaulterRecord);
          return response
        } catch (error) {
          console.error("Error al intentar crear un nuevo moroso: ", error);
          return error
        }
      } else { // when UPDATING...
        try {
          const response = await instance.put(`/defaulters/${defaulterId}`, defaulterRecord);
          return response
        } catch (error) {
          console.error(`Error al tratar de editar el moroso (nro ${defaulterId}): `, error);
          return error
        }
      }
    };

    const createOrUpdateThing = async(thingToSend) => {
      const { thing_id } = thingToSend
      if(thing_id === -1){ // when CREATING...
        try {
          const response = await instance.post('/things', thingToSend); 
          return response
        } catch (error) {
          console.error("Error al tratar de crear un nuevo producto: ", error);
          return error
        }
      } else { // when UPDATING...
        try {
          const response = await instance.put(`/things/${thing_id}`, thingToSend); 
          return response
        } catch (error) {
          console.error(`Error al tratar de editar el producto (nro ${thing_id}): `, error);
          return error
        }
      }
    };

    const createOrUpdateDebt = async(debtId, debtRecord) => {
      if(debtId === -1){ // when CREATING...
        try {
          const response = await instance.post('/debts', debtRecord);
          return response
        } catch (error) {
          console.error("Error al intentar crear una nueva deuda: ", error);
          return error
        }
      } else { // when UPDATING...
        try {
          const response = await instance.put(`/debts/${debtId}`, debtRecord);
          return response
        } catch (error) {
          console.error(`Error al intentar editar una deuda (nro ${debtId}): `, error);
          return error
        }
      }
    };

    const deleteModel = async(modelRoute, modelId) => { 
      try {
        const response = await instance.delete(`/${modelRoute}/${modelId}`);
        return response
      } catch (error) {
        console.error(`Error al intentar eliminar un modelo(${modelRoute}): `, error);
        return error
      }
    }

    const updateDebtCollection = async(defaulter_id, payload) => { 
      try {
        const response = await instance.put(`/debts/${defaulter_id}/multiple`, payload);
        return response
      } catch (error) {
        console.error(`Error al intentar editar la coleccion de deudas: `, error);
        return error
      }
    }

    const deleteDebtCollection = async(defaulter_id, payload) => { 
      try {
        const response = await instance.delete(`/debts/${defaulter_id}/multiple`, { data: payload });
        return response
      } catch (error) {
        console.error(`Error al intentar eliminar la coleccion de deudas: `, error);
        return error
      }
    }
    
    return {
      getAllDefaulters,
      getAllThings,
      getDefaulterInfoById,
      getThingsOfDefaulterById,
      createOrUpdateDefaulter,
      createOrUpdateThing,
      createOrUpdateDebt,
      deleteModel,
      updateDebtCollection,
      deleteDebtCollection,
      loaderDefaultersList,
      loaderSingleDefaulter,
    };
  };
  
  export default useApiRequests;