import React from "react"
import {useMutation} from '@tanstack/react-query'
import {addUserInPublicWorkspace} from "../api/workspace"
import {useNavigate} from "react-router-dom"
import {queryClient} from "../api/queryClient"

import {useUserStore} from "../store/authStore"

interface JoinPublicResponse{
        success: boolean;
        data: {
            id: string;
                    userId: string;
                    workspaceId: string;

        }
        message: string;
}


const JoinPublicWorkspace: React.FC<{workspaceId: string, userId: string}> = ({workspaceId, userId})=>{
    const lgid = useUserStore(state=>state.user?.id);
    const navigate = useNavigate();

    const joinPublicMutation = useMutation<JoinPublicResponse,any>({
        mutationFn: async()=>addUserInPublicWorkspace(workspaceId),
        onSuccess: (data)=>{
            if(data.success){
                queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
                queryClient.invalidateQueries({ queryKey: ["workspaces", lgid] });
                navigate(`/workspace/${workspaceId}`);
            }
        },
        onError: (err)=>{
            alert("error joining public workspace");
        }
    })

    
    const handleSubmit = ()=>{
        joinPublicMutation.mutate();
    }
    return (
        <>
            <p>It is a public workspace</p>
            <button onClick={handleSubmit}>Join</button>
        </>
    )
}

export default JoinPublicWorkspace;