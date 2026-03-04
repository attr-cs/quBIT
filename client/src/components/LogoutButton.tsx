import resetStores from "../store/resetStores";
import React from "react";

const LogoutButton: React.FC = ()=>{
    
    const handleLogout = ()=>{
        resetStores();
    }
    return (
        <>
        <button onClick={handleLogout} className="p-2 text-[#6e717c] text-1xl">Logout</button>
        </>
    )
}


export default LogoutButton