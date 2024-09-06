import mock_defaulters from '../data/defaulters.json'
import mock_defaulter from '../data/defaulter-info.json'

const useDefaulters = () => {

    const getAllDefaulters = async() => {
      try {
        return [ ...mock_defaulters ];
      } catch (error) {
        console.error("EXPLOTO ESTO --->: ", error);
      }
    };   
    
    const getDefaulterInfoById = async(defaulterId) => { 
        try {
            return { ...mock_defaulter };
        } catch (error) {
            console.error("EXPLOTO ESTO --->: ", error);
        }
    }
    
    return {
        getAllDefaulters,
        getDefaulterInfoById
    };
  };
  
  export default useDefaulters;