import React from "react";
import {useQuery} from "@tanstack/react-query";
import {getUserWorkspaces} from "../api/workspace"
import {useUserStore} from "../store/authStore"
import {useNavigate} from "react-router-dom";

interface MyWorkspacesInterface{
    id: string;
    name: string;
    isPrivate: boolean;
    createdAt: string;
    owner: {
        username: string
    },
    _count: {
        members: number
    }
}

const MyWorkspaces: React.FC = ()=>{
    const navigate = useNavigate();
    const userId = useUserStore(state=>state.user?.id);
    const {data: myWorkspacesData, isLoading, isError, error} = useQuery<MyWorkspacesInterface[]>({
        queryKey: ["myWorkspaces", userId],
        queryFn: getUserWorkspaces,
    })
    if(isLoading)return <p>loading..</p>
    if(isError)return <p>error loading your workspace</p>
    if(!myWorkspacesData) return null;
    return (
        <>
            <div style={{border: "2px solid blue"}}>My workspaces
                    {myWorkspacesData.map((workspace: MyWorkspacesInterface)=>{
                        return (
                <div key={workspace.id} onClick={()=>navigate(`/workspace/${workspace.id}`)}>
                    <div>{workspace.name}</div>
                    <div>{new Date(workspace.createdAt).toLocaleDateString()}</div>
                    <div>{workspace.owner.username}</div>
                    <div>{workspace.isPrivate ? "Private" : "Public"}</div>
                    
                    <div>{workspace._count.members}</div>
                </div>
                
            )
                    })}
            </div>        
        </>
    )



}

export default MyWorkspaces