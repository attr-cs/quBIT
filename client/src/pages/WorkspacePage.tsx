import {useParams, } from "react-router-dom"
import {getWorkspaceById,renameWorkspace} from "../api/workspace"
import {useMutation, useQuery} from "@tanstack/react-query"
import {useState, useEffect} from "react"
import {queryClient} from "../api/queryClient"
import {useUserStore} from "../store/authStore";
import { Lock, AlertCircle, EllipsisVertical } from "lucide-react";
import JoinPublicWorkspace from "../components/JoinPublicWorkspace"
import ToggleWorkspacePublicButton from "../components/ToggleWorkspacePublicButton"
import JoinPrivateWorkspace from "../components/JoinPrivateWorkspace";
import {Group, Panel, Separator} from 'react-resizable-panels';
import FolderFileHierarchy from "../components/FolderFileHierarchy";

// import FolderFileHierarchy from "../components/FolderFileHierarchy"

import GoBack from "../components/GoBack"

interface User{
    id: string;
    username: string;
}
interface File{
    id: string;
    name: string;
}

interface Member{
    user: User;
    role: "ADMIN" | "EDITOR" | "VIEWER";
}
interface Folder{
    id: string;
    name: string;
}
interface joinRequest{
    userId: string;
    workspaceId: string;
}

interface WorkspaceResponse{
    id: string;
    name: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    owner: User;
    joinRequests: joinRequest[];
    members: Member[],
    files: File[];
    folders: Folder[];
}


interface RenameWorkspaceResponse{
    success: string;
    message: string;
    data: {
        name: string;
    }
}
const WorkspacePage: React.FC = ()=>{

    const {id} = useParams<{id: string}>();
    const [workName, setWorkName]=useState<string>("");

    const userId = useUserStore(state=>state.user?.id);
    const {data: workspace, isLoading, isError, error} = useQuery<WorkspaceResponse>({
        queryKey: ["workspace",id],
        queryFn: async()=>getWorkspaceById(id!),
        enabled: !!id,
        retry: false,
        
    })

    const renameMutation = useMutation<RenameWorkspaceResponse,any>({
        mutationFn: async(name:string)=>renameWorkspace(id!, workName),
        onSuccess: (data)=>{
            if(data.success){
                queryClient.invalidateQueries({ queryKey: ["workspace", id] });
                queryClient.invalidateQueries({ queryKey: ["workspaces", userId] });
            }
        },
        onError: (err)=>{
            alert("error renaming the workspace");
        }
    })


    const handleRename = ()=>{
        const trimmed = workName.trim();
        if(trimmed && trimmed!==workspace?.name){
            renameMutation.mutate();

        }else{
            setWorkName(workspace?.name || "");
        }
    }

    useEffect(()=>{
        setWorkName(workspace?.name || "");
    }, [workspace])

    if(isLoading) return <p>loading..</p>
    if(isError) {
        let status = (error as any)?.response?.status;
        if (status === 401) {
            return <p>Session expired. Please login again.</p>;
        }

        if (status === 403) {
            const code = error.response?.data?.code;
            console.log(typeof code);
            if(code=="JOIN_REQUIRED"){
                 return <JoinPublicWorkspace workspaceId={id} userId={userId} />
            }
            return <JoinPrivateWorkspace workspaceId={id} /> ;
        }

        if (status === 404) {
            return <p>Workspace not found.</p>;
        }

        if (status === 500) {
            return <p>Server error. Please try later.</p>;
        }
        return <p>{(error as any)?.response.message}</p>
    }
    if(!workspace) return null;
    return (
        <div className="flex flex-col h-screen">
            {/* <GoBack /> */}

{/*             
            <p>{workspace.name}</p>
            <p>{workspace.owner.username}</p>
            <pre>{JSON.stringify(workspace, null, 2)}</pre> <br/>
            <pre>Join Requests {JSON.stringify(workspace.joinRequests, null, 2)}</pre>
            <p>isPrivate {workspace.isPrivate ? "private" : "public"} </p> */}
            {/* <FolderFileHierarchy workspaceId={workspace.id} rootFolders={workspace.folders} rootFiles={workspace.files} />
            <ul>
            {workspace.files.map(file=>
                <li key={file.id}>{file.name}</li>    
            )}
            <ul/>

            <p>{workspace.folders}</p> */}


            {/* <div className="flex  flex-row justify-between items-center  bg-[#071018] py-4 px-3">

                
                <div className="w-[50%] border-1 border-gray-400 rounded-md h-5">
                    long horizontal bar capcule with options, key shortcutes, search, themes and all
                </div>

                <div className="flex flex-row">
                <div>
                    <button>Members: 67</button>
                </div>
                <div>
                    three dots icon 
                    <EllipsisVertical size={22} className="text-gray-500 cursor-pointer hover:text-black"/>
                    <button>Activity</button>
                    <button>About</button>
                    <button>Settings</button>
                </div>
                </div>

            </div> */}

                        <Group direction="horizontal" className="flex-1 min-h-0">
                        <Panel defaultSize={25} minSize={15}>
                            <div className="h-full bg-[#212121] text-white overflow-auto py-3 px-2 flex flex-col">

                                <input type="text" 
                                onBlur={handleRename}
                                 disabled={renameMutation.isPending}
                                  onKeyDown={(e)=>{if(e.key==='Enter'){e.currentTarget.blur()}}} 
                                   className={`outline-none font-bold pl-3 mb-25 text-[#b3b5b7] capitalize border-b-2 ${renameMutation.isPending? "border-b-[#cbd2d9]" : "border-b-transparent focus:border-b-[#e4e7eb]" } `} 
                                 value={workName} onChange={(e)=>setWorkName(e.target.value)} placeholder="Workspace name"/>
                                <FolderFileHierarchy rootFolders={workspace.folders} rootFiles={workspace.files} workspaceId={workspace.id}/>
                             
                            </div>
                        </Panel>

                        <Separator className="w-[3px] bg-[#1c1e24] focus:outline-none hover:bg-blue-500 cursor-col-resize" />
                        <Panel defaultSize={65} minSize={15}>
                            <div className="h-full bg-[#111212] overflow-auto">
                                file.jsx
                            </div>
                        </Panel>

                        </Group>
            {/* <div className="grid grid-cols-12 overflow-hidden  flex-1">

                <div className="col-span-3 bg-black overflow-auto">file folder hierarchy</div>
                <div className="col-span-9 bg-gray-100 overflow-auto flex-1">file.jsx</div>

            </div> */}


            {/* <div className="text-[10px] px-2 py-[2px] bg-blue-700">text</div> */}
        </div>
    )
}

export default WorkspacePage;