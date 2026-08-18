import React, { useEffect, useState } from 'react'
import {useMutation} from '@tanstack/react-query'
import { registerUser } from '../api/auth';
import { useUserStore } from '../store/authStore';
import {Link, useNavigate} from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import LoginPageAnimation from '../components/LoginPageAnimation';

interface RegisterResponse{
    success: boolean;
    message: string;
    data:{
        user:{
            id:string;
            username:string;
            email:string;
            fname:string;
            lname:string;
        },
       
    }
}

const RegisterPage: React.FC = ()=>{

  const [showpass, setShowpass] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fname, setFName] = useState<string>("");
  const [lname, setLName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const setUser = useUserStore((state)=>state.setUser);
  
  const [errorT, setErrorT] = useState<string>("");
  const navigate = useNavigate();

    useEffect(()=>{        
            document.title = "Register Page";
    },[])

    const registerMutation = useMutation<RegisterResponse, any>({
        mutationFn: async()=>registerUser({username, email, fname, lname, password}),
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
        <div className="relative overflow-hidden bg-[#000000] w-full min-h-screen flex">
      {/* left side IDE animation  */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-1/2 p-8 justify-center items-center overflow-hidden border-r border-slate-800/60 bg-[url('/loginwall.jpg')]">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
            backgroundSize: `24px 24px`,
          }}
        />

        {/* Subtle Dark Vignette Fade on Edges */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-transparent to-transparent pointer-events-none" />

        {/* Centered Logo Animation */}
        <div className="relative z-10 w-full max-w-md flex justify-center items-center">
          <LoginPageAnimation />
        </div>
      </div>

      {/* right side login form */}
      <div className=" flex-1 flex justify-center items-center flex-col font-space bg-[#0a0d12]">
       

       <form onSubmit={handleSubmit} className="flex my-auto justify-center text-slate-300 w-[60%] md:w-[50%] lg:w-[60%] 2xl:w-[50%] items-center flex-col ">
        <div className="text-center mb-6">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-slate-100">
              Register on {" "}
              <span className="bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent font-bold">
                Qubit
              </span>
            </h1>
          </div>

            <div className="border-2  border-slate-400 px-4 py-2 w-full  my-2 ">
            <span className='text-slate-100 mr-2'>@</span>
            <input type="text" placeholder='username' className='outline-none font-semibold'  onChange={e=>setUsername(e.target.value)}  required/>

            </div>
            <input type="email" placeholder='putyour@email.here' className="border-2  border-slate-400 px-4 py-2 w-full outline-none font-semibold" onChange={e=>setEmail(e.target.value)}  required/>

            <div className="flex w-full justify-center border-box">

            <input type="text" placeholder='Kritrim' className='border-2  border-slate-400 px-4 py-2  my-2 outline-none border-r-0 w-1/2 font-semibold' onChange={e=>setFName(e.target.value)}  required/>

            <input type="text" placeholder='Sharma' className=' border-2  border-slate-400 px-4 py-2  my-2 outline-none w-1/2 font-semibold' onChange={e=>setLName(e.target.value)}  required/>

            </div>


            <div className="border-2 flex justify-center items-center border-slate-400 w-full">
            <input
              type={showpass ? "text" : "password"}
              id=""
              className=" px-4  py-2 w-full outline-none font-semibold"
              placeholder="**************"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              aria-label={showpass ? "Hide password" : "Show password"}
              onClick={() => setShowpass((showpass) => !showpass)}
              className="p-2 cursor-pointer"
            >
              {showpass ?  <Eye size={18} />:<EyeOff size={18} />}
            </button>
          </div>

              <p className="my-4"></p>
          {errorT && <p className="my-4 text-xs text-red-300">{errorT}</p>}

       

          <button
            disabled={registerMutation.isPending}
            type="submit"
            className="bg-slate-800 text-slate-250  w-full cursor-pointer hover:bg-slate-700 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ease-in-out duration-50 shadow-md hover:shadow-lg px-4 py-2"
          >
             {registerMutation.isPending ? <Loader2 className="animate-spin mx-auto" aria-hidden="true"/> : "Register"}
          </button>
           <p className="my-3">
            Already have an account?{" "}
            <Link to="/home" className="underline text-blue-300 hover:text-blue-200">
              Login here
            </Link>
          </p>
        </form>
       
          
          
          
         
        

         
        
        <p className="my-6 px-10 text-slate-300">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-slate-400 underline">
            Terms of Service and Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
        
    )
}

export default RegisterPage;