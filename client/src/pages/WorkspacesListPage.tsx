import React from "react"

import {getWorkspaces} from "../api/workspace";
import {useQuery} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom"
import WorkspaceCreate from "../components/WorkspaceCreate";
import WorkspaceRequests from "../components/WorkspaceRequests";
// import MyWorkspaces from "../components/MyWorkspaces";
import {useUserStore} from "../store/authStore"
import MainLayout from "../components/MainLayout"

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
        <MainLayout>
        <div className="lg:px-20 md:px-10 px-4 py-5 flex flex-col ">
            {/* <p className="mt-14">Workspace</p>  */}
            <div className="flex justify-center mt-25 ">
                <div>
                    <h2 className="my-2">My Workspaces</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row gap-5 ">
        <WorkspaceCreate />


        {/* <MyWorkspaces /> */}

        

        {workspaces.map((workspace: Workspaces)=>{
            if(workspace.isJoined){

            
            return (
                <div className={`aspect-square flex flex-col font-sans shadow-sm bg-brand-card w-40 h-40 text-sm rounded-md text-brand-write font-semibold hover:shadow-sm  group/card `} key={workspace.id} onClick={()=>navigate(`/workspace/${workspace.id}`)}>
                    {/* <div>{new Date(workspace.createdAt).toLocaleDateString()}</div> */}
                    <div className="flex p-3 justify-between">
                    <div>{workspace.isPrivate ? "" : "🌍Public"}</div>
                    {/* <div className="  italic text-semibold">@{workspace.owner.username}</div> */}

                    </div>
                    {/* <div>{workspace.isJoined ? "Joined" : "Not Joined"}</div> */}
                     {/* <div>{workspace._count.members}</div> */}
                     
                    
                    <div className="border-t-2 mt-auto text-xs py-2 text-left cursor-pointer hover:font-semibold pl-2 truncate capitalize border-t-brand-surface group-hover/card:text-[#636363]" title={workspace.name}>{workspace.name}</div>
                </div>
                
            )
        }
        })}

</div>
<h2 className="my-2 mt-5">Workspaces</h2>
 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row gap-5 ">
        {workspaces.map((workspace: Workspaces)=>{
            if(!workspace.isJoined){

            
            return (
                
                <div className={`aspect-square flex flex-col font-sans shadow-sm bg-brand-card w-40 h-40 text-sm rounded-md text-brand-write font-semibold group/card hover:shadow-sm`} key={workspace.id} onClick={()=>navigate(`/workspace/${workspace.id}`)}>
                    {/* <div>{new Date(workspace.createdAt).toLocaleDateString()}</div> */}
                    <div className="flex p-3 justify-between">
                    <div>{workspace.isPrivate ? "" : "🌍Public"}</div>
                    {/* <div className="  italic text-semibold">@{workspace.owner.username}</div> */}

                    </div>
                    {/* <div>{workspace.isJoined ? "Joined" : "Not Joined"}</div> */}
                     {/* <div>{workspace._count.members}</div> */}
                     
                    
                    <div className="border-t-2 mt-auto text-xs py-2 cursor-pointer group-hover/card:text-[#636363] text-left pl-2 truncate capitalize border-t-brand-surface " title={workspace.name}>{workspace.name}</div>
                </div>
                
            )
        }
        })}

        </div>

        </div>
            </div>

       
        <WorkspaceRequests />
        </div>
        </MainLayout>
    )
}

export default WorkspacesListPage;