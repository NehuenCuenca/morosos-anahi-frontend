import axios from "axios";

const useDefaulters = () => {
    const LOCAL_URL = import.meta.env.VITE_LOCAL_URL
    
    const instance = axios.create({
      baseURL: `${LOCAL_URL}/api/`,
      timeout: 2500,
      headers: {'X-Custom-Header': 'foobar'}
    });

    const getAllDefaulters = async(callParams) => {
      const { paginatedBy, page, orderByLastestRecent, orderByAlphabet } = callParams
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
    
    return {
        getAllDefaulters,
        getDefaulterInfoById,
        getItemsOfDefaulterById
    };
  };
  
  export default useDefaulters;