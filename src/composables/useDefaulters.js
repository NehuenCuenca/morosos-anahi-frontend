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
        return response.data
      } catch (error) {
        console.error("EXPLOTO ESTO --->: ", error);
      }
    };   
    
    const getDefaulterInfoById = async(defaulterId) => { 
        try {
          const response = await instance.get(`/defaulters/${defaulterId}`);
          return response.data.defaulter
        } catch (error) {
            console.error("EXPLOTO ESTO --->: ", error);
        }
    }
    
    const getItemsOfDefaulterById = async(defaulterId) => { 
        try {
          const response = await instance.get(`/defaulters/${defaulterId}/items`);
          return response.data.items
        } catch (error) {
            console.error("EXPLOTO ESTO --->: ", error);
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

    const createOrUpdateItem = async(itemRecord) => {
      const { item_id } = itemRecord
      if(item_id === -1){ // when CREATING...
        try {
          const response = await instance.post('/items', itemRecord);
          return response
        } catch (error) {
          console.error("EXPLOTO ESTO --->: ", error);
          return error
        }
      } else { // when UPDATING...
        try {
          const response = await instance.put(`/items/${item_id}`, itemRecord);
          return response
        } catch (error) {
          console.error("EXPLOTO ESTO --->: ", error);
          return error
        }
      }
    };

    const deleteItem = async(item_id) => {
      try {
        const response = await instance.delete(`/items/${item_id}`);
        return response
      } catch (error) {
        console.error("EXPLOTO ESTO --->: ", error);
        return error
      }
    };
    
    return {
        getAllDefaulters,
        getDefaulterInfoById,
        getItemsOfDefaulterById,
        createOrUpdateDefaulter,
        createOrUpdateItem,
        deleteItem
    };
  };
  
  export default useDefaulters;