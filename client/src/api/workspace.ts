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

const createWorkspace = async(name: string, isPrivate: boolean)=>{
    const {data} = await api.post("/workspace/createWorkspace", {name, isPrivate});
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
        username: userId,
        role: "EDITOR",
    });
    return data;
}

export  {getWorkspaces, getWorkspaceById, createWorkspace, joinWorkspaceRequest, addUserWorkspace, getJoinRequests};
