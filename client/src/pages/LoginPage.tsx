import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth";
import { useUserStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import LoginPageAnimation from "../components/LoginPageAnimation";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      name: string;
    };
  };
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showpass, setShowpass] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [errorT, setErrorT] = useState("");

  const loginMutation = useMutation<LoginResponse, any>({
    mutationFn: async () => loginUser({ username, password }),
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data.user);
        setErrorT("");
        navigate("/workspaces");
      }
    },
    onError: (err) => {
      setErrorT(err.response?.data?.message || "Login Failed");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate();
  };

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
        <form
          onSubmit={handleSubmit}
          className="flex my-auto justify-center text-slate-300 w-[60%] md:w-[50%] lg:w-[60%] 2xl:w-[50%] items-center flex-col "
        >
          <div className="text-center mb-6">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-slate-100">
              Sign in to{" "}
              <span className="bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent font-bold">
                Qubit
              </span>
            </h1>
          </div>
          <input
            type="text"
            id=""
            className="border-2  border-slate-400 px-4 py-2 w-full outline-none my-4 font-semibold"
            placeholder="putyour@email.here"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <p className="mt-1 w-full text-right ">
            <span className="cursor-pointer underline text-xs hover:text-slate-300 text-slate-200">Forgot password?</span>
            
          </p>
          <p className="my-4"></p>
          {errorT && <p className="my-4 text-xs text-red-300">{errorT}</p>}
          <button
            disabled={loginMutation.isPending}
            type="submit"
            className="bg-slate-800 text-slate-250  w-full cursor-pointer hover:bg-slate-700 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ease-in-out duration-50 shadow-md hover:shadow-lg px-4 py-2"
          >
            {loginMutation.isPending ? <Loader2 className="animate-spin mx-auto" aria-hidden="true"/> : "Login"}
          </button>

          <p className="my-3">
            Don't have an account?{" "}
            <Link to="/register" className="underline text-blue-300 hover:text-blue-200">
              Register here
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
  );
};

export default LoginPage;
