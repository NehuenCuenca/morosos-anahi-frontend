import { reactive, toRefs } from "vue";

const useLoader = ({ isLoading = false, msgWhileLoading = '', msgAfterLoading = '' }) => {    
    const initState = { isLoading, msgWhileLoading, msgAfterLoading }
    const loader = reactive({...initState})
    
    const resetLoader = () => { 
        const { isLoading, msgWhileLoading, msgAfterLoading } = initState

        loader.isLoading = isLoading
        loader.msgWhileLoading = msgWhileLoading
        loader.msgAfterLoading = msgAfterLoading
    }
    
    return { ...toRefs(loader), resetLoader };
};
  
export default useLoader;