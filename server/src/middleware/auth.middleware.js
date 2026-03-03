const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
    const token = req.cookies.accessToken;
    if(!token){
        return res.status(401).json({success: false, message: "Authentication Required", data: null});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
              
    }catch(err){
        return res.status(401).json({success: false, message: "Token expired or Invalid", data: null});
    }
}

module.exports = authMiddleware;