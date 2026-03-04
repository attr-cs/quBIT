import React from "react"

import {getWorkspaces} from "../api/workspace";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom"
import WorkspaceCreate from "../components/WorkspaceCreate";
import WorkspaceRequests from "../components/WorkspaceRequests";
// import MyWorkspaces from "../components/MyWorkspaces";
import {useUserStore} from "../store/authStore"
interface Workspaces{
    id: string;
    name: string;
    isPrivate: boolean;
    isJoined: boolean;
    createdAt: string;
    owner: {
        username: string;
    },
    _count: {
        members: number;
    }
}

const WorkspacesListPage: React.FC = ()=>{
    const lgid = useUserStore(state=>state.user?.id);
    const navigate = useNavigate();
    const {data: workspaces, isLoading, isError, error} = useQuery<Workspaces[]>({
        queryKey:  ["workspaces", lgid],
        queryFn: getWorkspaces,
    })


    // if(isSuccess) {console.log(workspaces); return null;}
    if(isLoading) return <p>loading..</p>
    if(isError) return <p>{(error as Error).message}</p>
    if(!workspaces) return null;
    return (
        <div className="px-20 py-5 flex flex-col ">
            {/* <p className="mt-14">Workspace</p>  */}
            <div className="flex justify-center mt-25 ">
                 <div className="grid grid-cols-4 grid-flow-row gap-5 ">
        <WorkspaceCreate />


        {/* <MyWorkspaces /> */}

        {workspaces.map((workspace: Workspaces)=>{
            return (
                <div className="aspect-square font-sans shadow-sm bg-brand-card w-40 h-40 text-sm rounded-md text-brand-write font-semibold" key={workspace.id} onClick={()=>navigate(`/workspace/${workspace.id}`)}>
                    <div>{workspace.name}</div>
                    <div>{workspace.isJoined ? "Joined" : "Not Joined"}</div>
                    <div>{new Date(workspace.createdAt).toLocaleDateString()}</div>
                    <div>{workspace.owner.username}</div>
                    <div>{workspace.isPrivate ? "Private" : "Public"}</div>
                     
                     <div>{workspace._count.members}</div>
                </div>
                
            )
        })}

        </div>

        
            </div>

       
        <WorkspaceRequests />
        </div>
    )
}

export default WorkspacesListPage;