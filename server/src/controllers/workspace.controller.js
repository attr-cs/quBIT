const prisma = require("../../db/db");


const createWorkspaces = async (req, res) => {
    try {
        const { name, isPrivate } = req.body;

        const userId = req.user.id;
        if (!name ) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const workspace = await prisma.workspace.create({
            data: {
                name,
                isPrivate: isPrivate ?? true,
                ownerId: userId,
                members: {
                    create: {
                        userId: userId,
                        role: "ADMIN"
                    }
                }
            }
        })

        return res.status(201).json({ success: true, message: "Workspace created successfully", data: {id: workspace.id} });

    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal server error ${err}` });
    }

}

const getWs = async (req, res) => {
    try {
        const workspaces = await prisma.workspace.findMany({
            select: {
                id: true,
                name: true,
                isPrivate: true,
                createdAt: true,
                owner: {
                    select: {
                        username: true,
                    },
                },
                _count: {
                    select: {
                        members: true
                    }
                },
                members: {
                    where: {
                        userId: req.user.id
                    },
                    select: {
                        id: true
                    }
                }
            }
        });


        const finalWorkspaces = workspaces.map(({members, ...rest})=>{
            return {...rest, isJoined: members.length > 0};
        })
        return res.status(200).json({ success: true, message: "Workspaces fetched successfully", data: finalWorkspaces });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal server error ${err}`, data: null });
    }
}


const getUserWs = async (req, res) => {
    try {
        const workspaces = await prisma.workspace.findMany({
            where: {
                ownerId: req.user.id
            },
            select: {
                id: true,
                name: true,
                isPrivate: true,
                createdAt: true,
                owner: {
                    select: {
                        username: true,
                    },
                },
                _count: {
                    select: {
                        members: true
                    }
                }
            }
        });
        return res.status(200).json({ success: true, message: "Workspaces fetched successfully", data: workspaces });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal server error ${err}` });
    }
}

const getW = async (req, res) => {
    try {

        const { id } = req.params;
        const workspace = await prisma.workspace.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                isPrivate: true,
                createdAt: true,
                updatedAt: true, 
                owner: { select: { id: true, username: true} },
                members: {
                    select: {

                        user: {
                            select: {
                                id: true,
                                username: true,
                                
                            }
                        },
                        role: true
                    }
                },
                joinRequests: {
                    where: {
                        status: "PENDING",
                    },
                    select: {
                        userId: true,
                        workspaceId: true,
                    }
                },
                files: {
                    where: {
                        folderId: null
                    },
                     select: {
                        id: true,
                        name: true,
                    }
                },
                folders: {
                    where: {
                        parentId: null
                    },
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found", data: null });
        }

        return res.status(200).json({ success: true, message: "Workspace fetched successfully", data: workspace });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal server error ${err}`, data: null });
    }
}

const renameW = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name) {
            return res.status(400).json({ success: false, message: `New workspace name required` });
        }
        if (!id) {
            return res.status(400).json({ success: false, message: `Workspace not found` });
        }

        // return res.status(404).json({success: false, message: `Workspace not found${err}`});  
        const workspace = await prisma.workspace.update({
            where: { id },
            data: { name }
        })

        return res.status(200).json({ success: true, message: "Renamed workspace successfully", data: {name: workspace.name} });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal server error ${err}` });
    }
}

const addUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { role } = req.body;
        if (!["ADMIN", "EDITOR", "VIEWER"].includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user) {
            return res.status(400).json({ success: false, message: `user not found` });
        }

        const workspace = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {

                    workspaceId: id,
                    userId: user.id
                }
            }
        })
        if (workspace) {
            return res.status(400).json({ success: false, message: `user already added to the workspace` });
        }
    
        const workspacemember = await prisma.workspaceMember.create({
            data: {
                workspaceId: id,
                userId: user.id,
                role
            },
            select: {
                id: true,
                userId: true,
                workspaceId: true
            }
        })
        return res.status(201).json({ success: true, message: "user added successfully", data: workspacemember });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal server error ${err}`, data:null });
    }
}

const joinRequestApprove =  async (req, res) => {
    try {
        const { id } = req.params;  // workspace id
        const { requestId } = req.body;    
        
        const joinRequest = await prisma.joinRequest.findUnique({
            where:{
                id: requestId,
            }
        })
        if(!joinRequest){
            return res.status(400).json({ success: false, message: `join request not found` ,data: null});
        }

        const workspace = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {

                    workspaceId: id,
                    userId: joinRequest.userId
                }
            }
        })
        if (workspace) {
            return res.status(400).json({ success: false, message: `user already added to the workspace` });
        }
    
        const workspacemember = await prisma.workspaceMember.create({
            data: {
                workspaceId: id,
                userId: joinRequest.userId,
                role: "EDITOR"
            }
        })

        const requestup = await prisma.joinRequest.update({
            where: {
                id: requestId,
            },
            data: {
                status: "APPROVED",
            }
        })
        if(!requestup){
            return res.status(400).json({ success: false, message: `couldnt update the join request`, data: null });
        }
        return res.status(201).json({ success: true, message: "user added successfully", data: workspacemember });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal server error ${err}`, data:null });
    }
}

const joinRequest = async(req, res)=>{

    try{
        const userId = req.user.id;
        const {workspaceId} = req.body;

        if(!workspaceId){
            return res.status(400).json({ success: false, message: `workspace id required`, data: null });
        }
        const isMember = await prisma.workspaceMember.findUnique({
            where:{
                userId_workspaceId:{
                    workspaceId,
                    userId
                }
            }
        })
        if(isMember){
            return res.status(400).json({ success: false, message: `already a member of this workspace`, data: null });
        }
        const exist = await prisma.joinRequest.findUnique({
            where:{
                userId_workspaceId:{
                    workspaceId,
                    userId
                }
            }
        })
        if(exist){
            return res.status(400).json({ success: false, message: `already requested`, data: null });
        }
        const joinRequest = await prisma.joinRequest.create({
            data: {
                userId,
                workspaceId
            }
        })
        return res.status(201).json({ success: true, message: "Requested successfully", data: joinRequest });
    }catch(err){
        return res.status(500).json({ success: false, message: `Internal server error ${err}`, data:null });
    }
}


const getJoinRequests = async(req,res)=>{
    try{
        const joinRequests = await prisma.joinRequest.findMany({
            where: {
                status: "PENDING",
                workspace: {
                    ownerId: req.user.id
                }
            },
            include: {
                user: {
                    select:{
                        
                        username: true,
                    }
                },
                workspace: {
                    select:{
                        
                        name: true,
                    }
                }
            }
        })
        if(!joinRequests){
            return res.status(400).json({ success: false, message: `No join requests`, data: null });
        }
        return res.status(201).json({ success: true, message: "Join requests fetched successfully", data: joinRequests });
    }catch(err){
        return res.status(500).json({ success: false, message: `Internal server error ${err}`, data:null });
    }
}

const removeUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        const user = await prisma.user.findUnique({
            where: { username }
        })
        if (!user) {
            return res.status(400).json({ success: false, message: `user not found` });
        }

        const workspace = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {

                    workspaceId: id,
                    userId: user.id
                }
            }
        })
        if (!workspace) {
            return res.status(400).json({ success: false, message: `user already removed from the workspace` });
        }

        const workspacemember = await prisma.workspaceMember.delete({
            where: {
                userId_workspaceId: {

                    workspaceId: id,
                    userId: user.id
                }
            }
        })
        return res.status(201).json({ success: true, message: "user removed successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal server error ${err}` });
    }
}

const deleteWorkspace = async (req, res) => {
    try {
        const { id } = req.params;
        const workspace = await prisma.workspace.findUnique({
            where: {
                id
            },
        })
        if (!workspace) {
            return res.status(400).json({ success: false, message: `workspace not found` });
        }
        const deletedworkspace = await prisma.workspace.delete({
            where: { id }
        })
        return res.status(201).json({ success: true, message: "workspace deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: `Internal server error ${err}` });
    }
}

const toggleWorkspacePublic = async(req,res)=>{
    try{
        const {id} = req.params;
    const workspace = await prisma.workspace.findUnique({
            where: {
                id
            },
        })
        if (!workspace) {
            return res.status(400).json({ success: false, message: `workspace not found` });
        }


    const updatedWorkspace = await prisma.workspace.update({
        where: {
            id
        },
        data:{
            isPrivate: !workspace.isPrivate,
        }
    })
    

    return res.status(201).json({ success: true, message: `workspace made ${updatedWorkspace.isPrivate} successfully`, data: {isPrivate: updatedWorkspace.isPrivate} });

    }catch(err){
         return res.status(500).json({ success: false, message: `Internal server error ${err}` });
    }
}
module.exports = { joinRequest ,toggleWorkspacePublic,joinRequestApprove ,getJoinRequests,createWorkspaces, getWs, getUserWs, getW, renameW, addUser, removeUser, deleteWorkspace }