import {useNavigate} from "react-router-dom"

import React from "react";
const GoBack: React.FC = ()=>{
    const navigate  = useNavigate();
    return (
    <button onClick={()=>window.history.length>1 ? navigate(-1): navigate("/workspaces")}>Back</button>
    )
}

export default GoBack;