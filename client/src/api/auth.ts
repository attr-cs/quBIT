import api from "./axios";

interface RegisterRequest{username: string; email: string; password: string; name: string}
interface LoginRequest{username: string; password: string}

const registerUser = async({username, email, password, name}: RegisterRequest)=>{
    const {data} = await api.post(`/auth/register`, {
        username,
        email,
        password,
        name
    });
    return data;
}

const loginUser = async({username, password}: LoginRequest)=>{
    const {data} = await api.post(`/auth/login`, {
        username, 
        password
    });
    return data;
}

export {registerUser, loginUser};