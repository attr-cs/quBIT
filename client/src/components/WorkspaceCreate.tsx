import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createWorkspace } from "../api/workspace";
import { useNavigate } from "react-router-dom";

interface CreateWorkspaceResponse{
    success: boolean;
    message: string;
    data:{
        id: string
    }
}

const WorkspaceCreate: React.FC = ()=>{
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [isPrivate, setIsPrivate] = useState<boolean>(true);
    const [wname, setWname] = useState<string>("");
    const navigate = useNavigate();

    const createWorkspaceMutation = useMutation<CreateWorkspaceResponse,any>({
        mutationFn: async()=> createWorkspace(wname, isPrivate),
        onSuccess: (data)=>{
            if(data.success){
                console.log(data.data);
                navigate(`/workspace/${data.data.id}`);
            }
        },
        onError: (err)=>{
            alert(`error ${err.response?.data?.message}`);
        }
    })

    const handleSubmit = ()=>{
        createWorkspaceMutation.mutate()
    }
    return (
        <div>
            <button onClick={()=>setIsCreating(true)}>New</button>
            {isCreating && (
                <div>
                    <input type="text" placeholder="workspace name" onChange={e=>setWname(e.target.value)}/>
                    <input type="checkbox" onChange={e=>setIsPrivate(!e.target.checked)} checked={!isPrivate} />Public
                    <button onClick={handleSubmit}>Create</button>
                    <button onClick={()=>setIsCreating(false)}>Cancel</button>
                </div>
            )}
        
        </div>
    )
}

export default WorkspaceCreate;