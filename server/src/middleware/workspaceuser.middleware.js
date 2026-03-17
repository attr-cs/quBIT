const jwt = require('jsonwebtoken');
const prisma = require('../../db/db');

const workspaceUserMiddleware = async(req, res, next)=>{
    try{
        const {id} = req.params;
        
        const workspace = await prisma.workspace.findUnique({
            where:{
                id
            }
        })
        if(!workspace){
            return res.status(404).json({success: false, message: "Workspace not found", data: null});    
        }

        

        const isMember = await prisma.workspaceMember.findFirst({
            where:{
                workspaceId: id,
                userId: req.user.id
            }
        })
        const isAllowed = workspace.ownerId === req.user.id  ||  !!isMember;

        if(!isAllowed && !workspace.isPrivate){
            // return res.status(403).json({success: false, message: "join the workspace first", data: null});    
            return res.status(403).json({code: "JOIN_REQUIRED"});    
        }

        if(!isAllowed){
        return res.status(403).json({code: "REQUEST_REQUIRED"});    
        }

        

        return next();
              
    }catch(err){
        return res.status(401).json({success: false, message: `Invalid Credentials ${err}`});
    }
}



module.exports = workspaceUserMiddleware;