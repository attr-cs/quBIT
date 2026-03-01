const jwt = require('jsonwebtoken');
const prisma = require('../../db/db');

const workspaceUserMiddleware = async(req, res, next)=>{
    try{
        const {id} = req.params;
        
        const exists = await prisma.workspace.findUnique({
            where: {
                id
            }
        })
        if(!exists){
        return res.status(404).json({success: false, message: "workspace doesnt exist"});    
        }

        const membership = await prisma.WorkspaceMember.findFirst({
            where:{
                workspaceId: id,
                userId: req.user.id
            }
        })

        if(!membership){
             return res.status(403).json({success: false, message: "not a member of this workspace"});    
        }


        next();
              
    }catch(err){
        return res.status(401).json({success: false, message: `Invalid Credentials ${err}`});
    }
}



module.exports = workspaceUserMiddleware;