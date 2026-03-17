import api from "./axios";
// import {useUserStore} from "../store/authStore";

const getWorkspaces = async()=>{
    const {data} = await api.get("/workspace/getWorkspaces");
    return data.data;
}

const getWorkspaceById = async(id:string)=>{
    const {data} = await api.get(`/workspace/getWorkspace/${id}`);
    return data.data;
}

// const createWorkspace = async(name: string, isPrivate: boolean)=>{
const createWorkspace = async()=>{
    const localname = "Untitled";
    const localstate = true;
    const {data} = await api.post("/workspace/createWorkspace", {name: localname,isPrivate: localstate});
    return data;
}
 
const joinWorkspaceRequest = async( workspaceId: string)=>{
    const {data} = await api.post(`/workspace/join-request`, {workspaceId});
    return data;
}

const getJoinRequests = async()=>{
    const {data} = await api.get("/workspace/get-join-requests");
    return data.data;
}

const addUserWorkspace = async(workspaceId: string, userId: string)=>{
    const {data} = await api.post(`/workspace/${workspaceId}/addUser`, {
        userId,
        role: "EDITOR",
    });
    return data;
}

const addUserInPublicWorkspace = async(workspaceId: string)=>{
    const {data} = await api.post(`/workspace/${workspaceId}/addUser`, {
        role: "VIEWER",
    });
    return data;
}

const getUserWorkspaces = async()=>{
    const {data} = await api.get(`/workspace/getUserWorkspaces`);
    return data.data;
}

const joinRequestApprove = async(workspaceId: string ,requestId: string)=>{
    const {data}= await api.post(`/workspace/${workspaceId}/approveRequest`, {requestId});
    return data;
}

const toggleWorkspacePublic = async(workspaceId: string)=>{
    const {data} = await api.post(`/workspace/${workspaceId}/togglePublic`);
    return data;
}

const renameWorkspace = async(workspaceId: string, name: string)=>{
    const {data} = await api.post(`/workspace/renameWorkspace/${workspaceId}`, {name: name});
    return data;
}

export  {joinRequestApprove,renameWorkspace, toggleWorkspacePublic,getUserWorkspaces, getWorkspaces, getWorkspaceById, createWorkspace, joinWorkspaceRequest, addUserInPublicWorkspace, getJoinRequests};
