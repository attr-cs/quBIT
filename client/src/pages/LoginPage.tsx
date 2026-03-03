import React, { useState } from "react"
import {useMutation} from '@tanstack/react-query'
import {loginUser} from '../api/auth'
import {useUserStore}  from "../store/authStore"
import {useNavigate} from 'react-router-dom'

interface LoginResponse{
    success: boolean;
    message: string;
    data:{
        user:{
            id:string;
            username:string;
            email:string;
            name:string;
        },
        
    }
}

const LoginPage: React.FC = ()=>{
    const [username, setUsername]= useState<string>("");
    const [password, setPassword]= useState<string>("");
    const setUser = useUserStore((state)=>state.setUser);
    const navigate = useNavigate();
    const [errorT, setErrorT] = useState<string>("");


    const loginMutation = useMutation<LoginResponse, any>({
        mutationFn: async()=>loginUser({username, password}),
        onSuccess: (data)=>{
            if(data.success){
                setUser(data.data.user);
                setErrorT("");
                navigate("/workspaces");
            }
        },
        onError: (err)=>{
            setErrorT(err.response?.data?.message || "Login Failed");
        }
    })


    const handleSubmit= (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        loginMutation.mutate();
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                id="" 
                placeholder="username or email"
                onChange={e=>setUsername(e.target.value)}
                required
                />
            <input 
                type="password" 
                id=""
                placeholder="password"   
                onChange={e=>setPassword(e.target.value)}
                required
            />
            {errorT && <p>{errorT}</p>}
            <button type="submit">Login</button>
        </form>
    )
}

export default LoginPage;