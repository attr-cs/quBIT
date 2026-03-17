import React, {useState} from "react"
import {useMutation} from '@tanstack/react-query'
import {queryClient} from '../api/queryClient'
import {toggleWorkspacePublic} from "../api/workspace"
import {useNavigate} from "react-router-dom"
import {useUserStore} from '../store/authStore'

interface MakePublicResponse{
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
            <button disabled={joinPublicMutation.isPending} onClick={handleSubmit} >{isPrivate? "Private": "Public"}</button>
        </>
    )
}

export default ToggleWorkspacePublicButton;