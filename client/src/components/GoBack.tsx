import {useNavigate} from "react-router-dom"

import React from "react";
const GoBack: React.FC = ()=>{
    const navigate  = useNavigate();
    return (
        
    <button onClick={()=>window.history.length>1 ? navigate(-1): navigate("/workspaces")} className="px-2 text-4xl text-[#ccd0cf] font-bold">&larr;</button>
    )
}

export default GoBack;