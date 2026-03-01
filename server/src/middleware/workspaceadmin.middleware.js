const jwt = require('jsonwebtoken');
const prisma = require('../../db/db');

const workspaceAdminMiddleware = async(req, res, next)=>{
    try{
        const {id} = req.params;
        
        const exists = await prisma.workspace.findUnique({
            where: {
                id,
                ownerId: req.user.id
            }
        })
        if(!exists){
        return res.status(403).json({success: false, message: "Not authorised for this operation"});    
        }
        next();
              
    }catch(err){
        return res.status(401).json({success: false, message: "Invalid Credentials"});
    }
}

module.exports = workspaceAdminMiddleware;