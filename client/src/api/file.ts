import api from "./axios";

export interface FileItem {
  id: string;
  name: string;
  folderId: string | null;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
}

export interface WorkspaceFilesFolders {
  folders: FolderItem[];
  files: FileItem[];
}


const createFile = async (
  name: string,
  workspaceId: string,
  userId: string,
  folderId: string | null = null
) => {
  const data = await api.post("/file/createfile", {
    name,
    workspaceId,
    userId,
    folderId,
  });
  return data;
};

const createFolder = async (
  name: string,
  workspaceId: string,
  userId: string,
  folderId: string | null = null
) => {
  const data = await api.post("/file/createfolder", {
    name,
    workspaceId,
    userId,
    folderId,
  });
  return data;
};

const getFilesFolders = async (
  workspaceId: string
)=> {
  const res = await api.get("/file/workspacefilesfolders", {
    params: { workspaceId },
  });
  return res.data.data; // { folders, files }
};

const getFileData = async(
    fileId: string
)=>{
  const res = await api.get(`/file/getFileData/${fileId}`);
  return res.data.data;
}

const updateFile = async (fileId: string, content: string) => {
  const res = await api.put("/file/updatefile", { id: fileId, content });
  return res.data.data;                             
};

export {createFile, createFolder, getFilesFolders, getFileData, updateFile}