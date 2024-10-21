import axios from "axios";

const useDefaulters = () => {
    const LOCAL_URL = import.meta.env.VITE_LOCAL_URL
    
    const instance = axios.create({
      baseURL: `${LOCAL_URL}/api/`,
      timeout: 2500,
      headers: {'X-Custom-Header': 'foobar'}
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
        console.error("EXPLOTO ESTO --->: ", error);
        return error
      }
    };   
    
    const getDefaulterInfoById = async(defaulterId) => { 
        try {
          const response = await instance.get(`/defaulters/${defaulterId}`);
          return response
        } catch (error) {
            console.error("EXPLOTO ESTO --->: ", error);
            return error
        }
    }
    
    const getThingsOfDefaulterById = async(defaulterId) => { 
        try {
          const response = await instance.get(`/defaulters/${defaulterId}/items`); //77
          return response
        } catch (error) {
          console.error("EXPLOTO ESTO --->: ", error);
          return error
        }
    }

    const createOrUpdateDefaulter = async(defaulterId, defaulterRecord) => {
      if(defaulterId === -1){ // when CREATING...
        try {
          const response = await instance.post('/defaulters', defaulterRecord);
          return response
        } catch (error) {
          console.error("EXPLOTO ESTO --->: ", error);
          return error
        }
      } else { // when UPDATING...
        try {
          const response = await instance.put(`/defaulters/${defaulterId}`, defaulterRecord);
          return response
        } catch (error) {
          console.error("EXPLOTO ESTO --->: ", error);
          return error
        }
      }
    };

    const createOrUpdateThing = async(thingToSend) => {
      const { item_id } = thingToSend
      if(item_id === -1){ // when CREATING...
        try {
          const response = await instance.post('/items', thingToSend); //77
          return response
        } catch (error) {
          console.error("EXPLOTO ESTO --->: ", error);
          return error
        }
      } else { // when UPDATING...
        try {
          const response = await instance.put(`/items/${item_id}`, thingToSend); //77
          return response
        } catch (error) {
          console.error("EXPLOTO ESTO --->: ", error);
          return error
        }
      }
    };

    const deleteThing = async(thing_id) => {
      try {
        const response = await instance.delete(`/items/${thing_id}`);
        return response
      } catch (error) {
        console.error("EXPLOTO ESTO --->: ", error);
        return error
      }
    };
    
    return {
      getAllDefaulters,
      getDefaulterInfoById,
      getThingsOfDefaulterById,
      createOrUpdateDefaulter,
      createOrUpdateThing,
      deleteThing
    };
  };
  
  export default useDefaulters;