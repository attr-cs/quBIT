const prisma = require("../../db/db");


const createWorkspaces = async(req,res)=>{
    try{
        const {name } = req.body;
        const userId = req.user.id;
    if(!name){
        return res.status(400).json({success: false, message: "Workspace name required"});
    }

    const workspace  = await prisma.workspace.create({
        data: {
            name, 
            ownerId: userId,
            members: {
                create: {
                    userId: userId,
                    role: "ADMIN"
                }
            }
        }
    })

    return res.status(201).json({success: true, message: "Workspace created successfully", data: workspace});
    
    }catch(err){
        return res.status(500).json({success: false, message: `Internal server error ${err}`});
    }

}

const getWs = async(req,res)=>{
    try{
        const workspaces = await prisma.workspace.findMany();
        return res.status(200).json({success: true, message: "Workspaces fetched successfully", data: workspaces});
    }catch(err){
        return res.status(500).json({success: false, message: `Internal server error ${err}`});
    }
}


const getUserWs  = async(req,res)=>{
   try{
        const workspaces = await prisma.workspace.findMany({
            where:{
                ownerId: req.user.id
            },
        });
        return res.status(200).json({success: true, message: "Workspaces fetched successfully", data: workspaces});
    }catch(err){
        return res.status(500).json({success: false, message: `Internal server error ${err}`});
    }
}

const getW = async(req,res)=>{
    try{

        const {workspaceid} = req.params.id;
        const workspace = await prisma.workspace.findFirst({
            where:{
                id: workspaceid,
                OR: [
                    {ownerId: req.user.id},
                    {
                        members:{
                            some:{
                                userId: req.user.id
                            }
                        }
                    }
                ]
            },
            include: {
                owner: true,
                members: {select: {userId: true, role: true}},
                files: true,
                folders: true
            }
        });
        if(!workspace){
            return res.status(404).json({success: false, message: "Workspace not found"});    
        }

        return res.status(200).json({success: true, message: "Workspace fetched successfully", data: workspace});
    }catch(err){
        return res.status(500).json({success: false, message: `Internal server error ${err}`});
    }
}

const renameW = async(req,res)=>{
    try{
        const {name} = req.body;
        const {id} = req.params;

        if(!name){
          return res.status(400).json({success: false, message: `New workspace name required`});  
        }
        if(!id){
          return res.status(400).json({success: false, message: `Workspace not found`});  
        }
        
        // return res.status(404).json({success: false, message: `Workspace not found${err}`});  
        const workspace = await prisma.workspace.update({
            where: {id},
            data:{name}
        })

        return res.status(200).json({success: true, message: "Renamed workspace successfully"});
    }catch(err){
         return res.status(500).json({success: false, message: `Internal server error ${err}`});
    }
}

const addUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const {username, role} = req.body;
        if (!["ADMIN", "EDITOR", "VIEWER"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }
        const user = await prisma.user.findUnique({
            where: {username}
        })
        if(!user){
            return res.status(400).json({success: false, message: `user not found`});  
        }

        const workspace = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId:{

                    workspaceId: id,
                    userId: user.id
                }
            }
        })
        if(workspace){
            return res.status(400).json({success: false, message: `user already added to the workspace`});  
        }

        const workspacemember = await prisma.workspaceMember.create({
            data: {
                workspaceId: id,
                userId: user.id,
                role
            }
        })
        return res.status(201).json({success: true, message:"user added successfully", data: workspacemember});
    }catch(err){
         return res.status(500).json({success: false, message: `Internal server error ${err}`});
    }
}
module.exports = {createWorkspaces, getWs, getUserWs, getW, renameW, addUser}