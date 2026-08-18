import React, {useState} from "react"
import {useMutation} from '@tanstack/react-query'
import {queryClient} from '../api/queryClient'
import {toggleWorkspacePublic} from "../api/workspace"
import {useNavigate} from "react-router-dom"
import {useUserStore} from '../store/authStore'
import { Globe, GlobeOff } from "lucide-react"

interface JoinPublicResponse{
        success: boolean;
        message: string;
        data: {isPrivate: boolean};
}


const ToggleWorkspacePublicButton: React.FC<{workspaceId: string, isPrivate: boolean}> = ({workspaceId, isPrivate})=>{
    const lgid = useUserStore(state=>state.user?.id);
    const navigate = useNavigate();
    const joinPublicMutation = useMutation<JoinPublicResponse,any>({
        mutationFn: async()=>toggleWorkspacePublic(workspaceId),
        onSuccess: (data)=>{
            if(data.success){
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
                queryClient.invalidateQueries({ queryKey: ["workspaces", lgid] });
            }
        },
        onError: (err)=>{
            alert("error making the workspace public");
        }
    })

    
    const handleSubmit = ()=>{
        joinPublicMutation.mutate();
    }
    return (
        <>
         <button type="button" disabled={joinPublicMutation.isPending} onClick={handleSubmit} className="rounded-full  cursor-pointer w-10 h-10 flex hover:bg-[#1e1e1e]  transition-colors justify-center items-center">

        {isPrivate? <GlobeOff size={18} className="active:scale-110 text-[#ffffff]"/>: <Globe size={20} className="active:scale-110 text-[#ffffff]"/>}
            

    </button>

        
        </>
    )
}

export default ToggleWorkspacePublicButton;