const prisma = require("../../db/db");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const register = async(req,res)=>{
    try{
        const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.json(400).json({success: false, message: "All fields required"});
    }

    const exists = await prisma.user.findFirst({
        where: {
            OR: [
                {email},
                {username}
            ]
        }
    })
    if(exists){
        return res.json(409).json({success: false, message: "User already exists"});
    }
    
    const hashpass = await bcrypt.hash(password, 10);
    
    const role = await prisma.role.findUnique({where: {name: "USER"}});
    
    if(!role){
        return res.json(500).json({success: false, message: "Default role not found"});

    }

    const newUser = await prisma.user.create({
        data: { 
            username,
            email,
            password: hashpass,
            roleId: "User"
        },
    })


    const token = jwt.sign(
        {id: newUser.id, email: newUser.email},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    )

    return res.status(201).json({
        success: true,
        message: "user registered succesfully",
        data: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token
        }
    });
    }catch(error){
        console.error("Register error: ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error, user could not be created"
        })
    }
}

module.exports = {register}