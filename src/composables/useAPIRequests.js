import axios from "axios";

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

    const getAllDefaulters = async(callParams) => {
      // const { paginatedBy, page, orderByLastestRecent, orderByAlphabet } = callParams
      try {
        const response = await instance.get('/defaulters', {
          params: {
            ...callParams
          }
        });
        return response
      } catch (error) {
        console.error("Error al intentar conseguir los morosos: ", error);
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
        try {
          const response = await instance.get(`/defaulters/${defaulterId}`);
          return response
        } catch (error) {
            console.error(`Error al tratar de conseguir el moroso (nro ${defaulterId}): `, error);
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
      deleteDebtCollection
    };
  };
  
  export default useApiRequests;