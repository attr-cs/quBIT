import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    withCredentials: true,
})


// handle global level errors like 401- logout, network error-- show no internet, token expired-- redirect login
// api.interceptors.response.use((response)=>response, (error)=>{
//     const status = error?.response.status;

//     if(status===401){
//         window.location.href = "/login";
//     }else if(status === 403)
// })


export default api;