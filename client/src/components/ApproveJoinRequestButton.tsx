import React, { useState } from "react"
import {useMutation} from "@tanstack/react-query"
import { joinRequestApprove } from "../api/workspace";

interface ApproveRequest{
    workspaceId: string ;
    requestId: string;
}

const ApproveJoinRequestButton: React.FC<ApproveRequest> = ({workspaceId ,requestId})=>{
    const [isApprove, setIsApprove] = useState<boolean>(false);

    const approveMutation = useMutation<any>({
        mutationFn: async()=>joinRequestApprove(workspaceId,requestId),
        onSuccess: (data)=>{
            setIsApprove(true);
        },
        onError: (err)=>{
            alert("couldnt approve");
        }
    })
    const handleClick = ()=>{
        approveMutation.mutate();
    }
    return (
        <>
        {!isApprove? <button onClick={handleClick}>Approve</button>: <p>Approved</p>}
        
        </>
    )
}

export default ApproveJoinRequestButton