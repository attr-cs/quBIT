import React from "react";
import LogoutButton from "./LogoutButton"


const MainLayout: React.FC<{ children: React.ReactNode}> = ({children})=>{
    return (
        <div className="min-h-screen bg-brand-surface h-full w-full px-6 py-7 font-mono">
            <div className="flex justify-between flex-rows">
                <p className="text-[#9ba8ab] text-2xl "><span className="text-[#ccd0cf]">Q</span>ubit</p>    
                <LogoutButton />
            </div>
            
            
            {children}
        </div>
    )
}
export default  MainLayout;