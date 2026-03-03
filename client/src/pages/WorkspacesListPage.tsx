import React from "react"
import resetStores from "../store/resetStores";
import {getWorkspaces} from "../api/workspace";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom"
import WorkspaceCreate from "../components/WorkspaceCreate";
import WorkspaceRequests from "../components/WorkspaceRequests";
import {useUserStore} from "../store/authStore"
interface Workspaces{
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

const WorkspacesListPage: React.FC = ()=>{
    const lgid = useUserStore(state=>state.user?.id);
    const navigate = useNavigate();
    const {data: workspaces, isLoading, isError, error} = useQuery<Workspaces[]>({
        queryKey:  ["workspaces", lgid],
        queryFn: getWorkspaces,
    })


    const handleLogout = ()=>{
        resetStores();
    }
    // if(isSuccess) {console.log(workspaces); return null;}
    if(isLoading) return <p>loading..</p>
    if(isError) return <p>{(error as Error).message}</p>
    if(!workspaces) return null;
    return (
        <div>Workspace
<button onClick={()=>window.history.length>1 ? navigate(-1): navigate("/workspaces")}>Back</button>
        <WorkspaceCreate />

        <WorkspaceRequests />


        {workspaces.map((workspace: Workspaces)=>{
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

<button onClick={handleLogout}>Logout</button>

        </div>
    )
}

export default WorkspacesListPage;