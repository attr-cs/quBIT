import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getJoinRequests } from "../api/workspace";
import {useUserStore} from "../store/authStore"
import ApproveJoinRequestButton from "./ApproveJoinRequestButton";

interface joinRequests{
    id: string;
    userId: string;
    workspaceId: string;
    user:{
        
        username: string;
    },
    workspace: {
        
        name: string;
    }
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
}

const WorkspaceRequests: React.FC = ()=>{
    const lgid = useUserStore(state=>state.user?.id);
    const {data: requests, isLoading, isError, error} = useQuery<joinRequests[]>({
        queryKey: ["join-requests", lgid],
        queryFn: getJoinRequests,
    })

    if(isLoading)return <p>loading join requests..</p>
    if(isError)return <p>Error loading join requests</p>
    if(!requests)return null;
    return (
        <div>
            {requests.map(r=>(
                <div key={r.id} style={{border:"2px solid black"}}>
                    <div>{r.userId}</div>
                    <div>{r.user?.username}</div>
                    <div>{r.workspaceId}</div>
                    <div>{r.workspace?.name}</div>
                    <div>{r.status}</div>
                    <ApproveJoinRequestButton workspaceId={r.workspaceId} requestId={r.id} />
                </div>
            ))}
        </div>
    )
}

export default WorkspaceRequests