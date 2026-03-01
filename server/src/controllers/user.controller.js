const prisma = require("../../db/db");

const getAllUsers = async (req,res)=>{
    try{
        const users = await prisma.user.findMany({
            select:{
                id:true,
                name:true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return res.status(200).json({success: true, message: "All users fetched", data: users});
    }catch(err){
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

const getWorkspaceUsers = async(req,res)=>{
    try{
        const {id} = req.params;
        const users = await prisma.workspace.findUnique({
            where: {
                id
            },
            select:{
                members: {
                    select:{
                        user: true,
                        role: true
                    }
                }
                
            }
        })
        return res.status(200).json({success: true, message: "All workspace users fetched", data: users});
    }catch(err){
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

const getMe = async (req,res)=>{
    try{
        const users = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                
                name:true,
                username: true,
                email: true,
                ownedWorkspaces: {select: {id: true, name: true}},
                workspaceMembers: {select: {workspaceId: true, role: true}},
                password: false
            }
        });
        return res.status(200).json({success: true, message: "All users fetched", data: users});
    }catch(err){
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

module.exports = {getAllUsers, getMe, getWorkspaceUsers}