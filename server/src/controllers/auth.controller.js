const prisma = require("../../db/db");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


const login = async(req,res)=>{
   try{
     const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({success: false, message: "All fields required"});
    }

    const existUser = await prisma.user.findFirst({
        where: {
            OR: [
                {email: username},
                {username: username}
            ]
        }
    })

    if(!existUser){
        return res.status(401).json({success: false, message: "Invalid Credentials"});
    }


    const matches = await bcrypt.compare(password, existUser.password);
    if(!matches){
        return res.status(401).json({success: false, message: "Invalid Credentials"});
    }

    let token = jwt.sign(
        {id: existUser.id, email: existUser.email},
        process.env.JWT_SECRET,
        {expiresIn: '7d'},
    )
    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            id: existUser.id,
            username: existUser.username,
            email: existUser.email,
            name: existUser.name,
            token
        }
    })
   }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error, user could not be verified"
        })
   }
    
}



const register = async(req,res)=>{
    try{
        const {username, email, password, name} = req.body;

    if(!username || !email || !password || !name){
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
    
    
    
   
    const newUser = await prisma.user.create({
        data: { 
            username,
            email,
            name,
            password: hashpass,
            
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
            name: newUser.name,
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

module.exports = {register, login}






// dummies
// {
//   "username": "krishna",
//   "email": "dhruvbh108@gmail.com",
//   "password": "dhruv219",
//   "name": "Vasudev Krishna"
// }