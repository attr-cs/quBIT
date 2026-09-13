const prisma = require("../../db/db");



const createFile = async (req, res) => {
  try {
    const { name, workspaceId, userId, folderId } = req.body;

    const file = await prisma.file.create({
      data: { name, workspaceId, userId, folderId },
    });

    if (!file) {
      return res
        .status(500)
        .json({ success: false, message: "File couldnt be created" });
    }

    return res.status(200).json({
      success: true,
      message: "File created",
      data: {
        id: file.id,
        userId: file.userId,
        workspaceId: file.workspaceId,
        folderId: file.folderId,
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: e });
  }
};

const createFolder = async (req, res) => {
  try {
    const { name, workspaceId, userId, folderId } = req.body;

    const folder = await prisma.folder.create({
      data: { name, workspaceId, userId, parentId: folderId },
    });

    if (!folder) {
      return res
        .status(500)
        .json({ success: false, message: "Folder couldnt be created" });
    }

    return res.status(200).json({
      success: true,
      message: "Folder created",
      data: {
        id: folder.id,
        userId: folder.userId,
        workspaceId: folder.workspaceId,
        folderId: folder.parentId,
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


const getWorkspacefilesfolders = async (req, res) => {
  try {
    // Accept workspaceId from query (?workspaceId=), route params, or body.
    const workspaceId =
      req.query?.workspaceId || req.params?.workspaceId || req.body?.workspaceId;

    if (!workspaceId) {
      return res
        .status(400)
        .json({ success: false, message: "workspaceId is required" });
    }

    const [folders, files] = await Promise.all([
      prisma.folder.findMany({ where: { workspaceId } }),
      prisma.file.findMany({ where: { workspaceId } }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Files and folders fetched",
      data: { folders, files },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: e.message });
  }
};

const getFileData = async(req,res)=>{
    const {id} = req.params;
    try{
      const file = await prisma.file.findFirst({
        where:{
          id
        },
        select:{
          content: true,
          name: true,
        }
      })
      if(!file){
        return res
      .status(400)
      .json({ success: false, message: "File doesnt exist" });
      }
      
      
      return res.status(200).json({
      success: true,
      message: "File data fetched",
      data: {
        content: file.content || "",
        fileName: file.name,
      } ,
    });
      
    }catch(e){
      return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: e.message });
    }
}

const updateFile = async (req, res) => {
  const { id, content } = req.body;                 
  if (!id) {                                        
    return res.status(400).json({ success: false, message: "id is required" });
  }
  try {
    const file = await prisma.file.update({        
      where: { id },                                 
      data: { content },                            
    });
    return res.status(200).json({                     
      success: true,
      message: "File saved",
      data: { id: file.id, content: file.content },
    });
  } catch (e) {                               exist
    return res.status(500).json({ success: false, message: "Couldn't save file", error: e.message });
  }
};

module.exports = {createFile, createFolder, getWorkspacefilesfolders, getFileData, updateFile}