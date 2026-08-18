const prisma = require("../../db/db");


const createFile = async( req, res)=>{
    try{
        const {name, workspaceId, userId, folderId} = req.body;

        const file = await prisma.file.create({
            name,
            workspaceId,
            userId,
            folderId
        })

        if(!file){
            return res.status(500).json({success: false, message: "Internal server error"});
        }

        return res.status(200).json({success: true, message: "File created", data: {
            id: (await file).id,
            userId: (await file).userId,
            workspaceId: (await file).workspaceId,
            folderId: (await file).folderId
        }})

    }catch(e){
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

const createFolder = async( req, res)=>{
    try{
        const {name, workspaceId, userId, folderId} = req.body;

        const folder = await prisma.file.create({
            name,
            workspaceId,
            userId,
            parentId: folderId
        })

        if(!folder){
            return res.status(500).json({success: false, message: "Internal server error"});
        }

        return res.status(200).json({success: true, message: "Folder created", data: {
            id: (await folder).id,
            userId: (await folder).userId,
            workspaceId: (await folder).workspaceId,
            folderId: (await folder).parentId
        }})

    }catch(e){
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

const getWorkspacefilesfolders = async( req, res)=>{
    try{
        const {name, workspaceId, userId, folderId} = req.body;

        const fifos = await prisma.workspace.findMany();

        if(!fifos){
            return res.status(500).json({success: false, message: "No File Folders found"});
        }

        return res.status(200).json({success: true, message: "File created", data: fifos})

    }catch(e){
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}

module.exports = {createFile, createFolder, getWorkspacefilesfolders}