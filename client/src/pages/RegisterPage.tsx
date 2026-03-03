import React, { useEffect, useState } from 'react'
import {useMutation} from '@tanstack/react-query'
import { registerUser } from '../api/auth';
import { useUserStore } from '../store/authStore';
import {useNavigate} from 'react-router-dom'

interface RegisterResponse{
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

const RegisterPage: React.FC = ()=>{

    
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const setUser = useUserStore((state)=>state.setUser);
  
  const [errorT, setErrorT] = useState<string>("");
  const navigate = useNavigate();

    useEffect(()=>{        
            document.title = "Register Page";
    },[])

    const registerMutation = useMutation<RegisterResponse, any>({
        mutationFn: async()=>registerUser({username, email, name, password}),
        onSuccess: (data)=>{
            if(data.success){
                setErrorT("");
                setUser(data.data.user);
                navigate("/workspaces");
            }
        },
        onError: (err)=>{
            setErrorT(err.response?.data?.message || "Login Failed");
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        registerMutation.mutate();
    }

    
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='username' onChange={e=>setUsername(e.target.value)}  required/>
            <input type="email" placeholder='email' onChange={e=>setEmail(e.target.value)}  required/>
            <input type="text" placeholder='name' onChange={e=>setName(e.target.value)}  required/>
            <input type="password" placeholder='password' onChange={e=>setPassword(e.target.value)}  required/>
            <button type="submit">Register</button>
            {errorT && <p>{errorT}</p>}
            
        </form>
    )
}

export default RegisterPage;