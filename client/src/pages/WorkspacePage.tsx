import {useParams, } from "react-router-dom"
import {getWorkspaceById} from "../api/workspace"
import {useQuery} from "@tanstack/react-query"
import {useUserStore} from "../store/authStore";

// import FolderFileHierarchy from "../components/FolderFileHierarchy"
import WorkspaceJoinRequest from "../components/WorkspaceJoinRequest";
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
interface WorkspaceResponse{
    id: string;
    name: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    owner: User;
    members: Member[],
    files: File[];
    folders: Folder[];
}

const WorkspacePage: React.FC = ()=>{

    const {id} = useParams<{id: string}>();

    const {data: workspace, isLoading, isError, error} = useQuery<WorkspaceResponse>({
        queryKey: ["workspace",id],
        queryFn: async()=>getWorkspaceById(id!),
        enabled: !!id,
        retry: false,
        
    })


    if(isLoading) return <p>loading..</p>
    if(isError) {
        let status = (error as any)?.response?.status;
        if (status === 401) {
            return <p>Session expired. Please login again.</p>;
        }

        if (status === 403) {
            return (
                <div>
                    <GoBack />
                    <p>You are not authorized to access this workspace.</p>
                    <WorkspaceJoinRequest workspaceId={id!} />
                </div>
        );
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
        <div>
            <GoBack />
            <p>{workspace.name}</p>
            <p>{workspace.owner.username}</p>
            <pre>{JSON.stringify(workspace, null, 2)}</pre>
            <p>isPrivate {workspace.isPrivate} </p>
            {/* <FolderFileHierarchy workspaceId={workspace.id} rootFolders={workspace.folders} rootFiles={workspace.files} />
            <ul>
            {workspace.files.map(file=>
                <li key={file.id}>{file.name}</li>    
            )}
            <ul/>

            <p>{workspace.folders}</p> */}
        </div>
    )
}

export default WorkspacePage;