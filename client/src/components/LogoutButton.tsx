import { LogOut } from "lucide-react";
import resetStores from "../store/resetStores";
import React from "react";

const LogoutButton: React.FC = ()=>{
    
    const handleLogout = ()=>{
        resetStores();
    }
    return (
    <div onClick={handleLogout} className="rounded-full  cursor-pointer w-10 h-10 flex hover:bg-slate-900 transition-colors justify-center items-center">
      <LogOut  size={20} className=" text-[#ffffff]"/>
    </div>

        
    )
}


export default LogoutButton