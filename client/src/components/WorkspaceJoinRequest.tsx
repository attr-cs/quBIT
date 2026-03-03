import React, { useState } from "react";
import { joinWorkspaceRequest } from "../api/workspace";
import { useMutation } from "@tanstack/react-query";



const WorkspaceJoinRequest:React.FC<{workspaceId: string}> = ({workspaceId})=>{
    const [sent, setSent]= useState<boolean>(false);
    const joinMutation = useMutation<any, any>({
        mutationFn: async()=>joinWorkspaceRequest( workspaceId),
        onSuccess: (data)=>{
             if(data.success){
                setSent(true);
            }
        },
        onError: (err)=>{
            alert("Request not made")
        }
    })

    const handleClick = ()=>{
        joinMutation.mutate();
    }
    return (
        <div>
            <button onClick={handleClick}>Join Request</button>
            {sent && <p>Request Sent</p>}
        </div>
    )
}

export default WorkspaceJoinRequest;