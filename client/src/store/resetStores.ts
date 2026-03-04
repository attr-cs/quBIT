import {useUserStore} from "./authStore"
import {queryClient} from "../api/queryClient"
const resetStores = ()=>{
    useUserStore.getState().reset();
    queryClient.clear();
}

export default resetStores;