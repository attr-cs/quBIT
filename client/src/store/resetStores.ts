import {useUserStore} from "./authStore"
import {queryClient} from "../main"
const resetStores = ()=>{
    useUserStore.getState().reset();
    queryClient.clear();
}

export default resetStores;