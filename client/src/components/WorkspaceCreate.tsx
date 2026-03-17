import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createWorkspace } from "../api/workspace";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/authStore";
import {queryClient} from "../api/queryClient"

interface CreateWorkspaceResponse{
    success: boolean;
    message: string;
    data:{
        id: string
    }
}

const WorkspaceCreate: React.FC = ()=>{
    // const [isCreating, setIsCreating] = useState<boolean>(false);
    // const [isPrivate, setIsPrivate] = useState<boolean>(true);
    // const [wname, setWname] = useState<string>("");
    const lgid = useUserStore(state=>state.user?.id);
    
    const navigate = useNavigate();

    const createWorkspaceMutation = useMutation<CreateWorkspaceResponse,any>({
        // mutationFn: async()=> createWorkspace(wname, isPrivate),
        mutationFn: async()=> createWorkspace(),
        onSuccess: (data)=>{
            if(data.success){
                console.log(data.data);
                queryClient.invalidateQueries({queryKey: ["workspaces", lgid]})
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
        <>
        <div>

        <div onClick={handleSubmit} className="aspect-square hover:shadow-sm hover:border-brand-bright/30 transition-all duration-300   cursor-pointer bg-brand-card w-40 h-40 text-sm rounded-md text-[#ccd0cf]h font-semibold flex justify-center content-center">
            <button  className="text-2xl text-[#646464] text-bold cursor-pointer ">+ New</button>
        </div>
        {/* <div>

            {isCreating && (
                <div className="fixed inset-0 bg-[#646464] opacity-50 flex justify-center content-center">

                <div className="w-52 h-52 bg-brand-surface rounded-sm shadow-sm border-brand-card p-5">
                    <input type="text" placeholder="workspace name" onChange={e=>setWname(e.target.value)}/>
                    <input type="checkbox" onChange={e=>setIsPrivate(!e.target.checked)} checked={!isPrivate} />Public
                    <button onClick={handleSubmit}>Create</button>
                    <button onClick={()=>setIsCreating(false)}>Cancel</button>
                </div>
                </div>
            )}
        </div> */}
        </div>
        
        </>
    )
}

export default WorkspaceCreate;