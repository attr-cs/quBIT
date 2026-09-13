const prisma = require("../../db/db");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


const login = async(req,res)=>{
   try{
     const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({success: false, message: "All fields required", data: null});
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
        return res.status(401).json({success: false, message: "Invalid Credentials", data: null});
    }


    const matches = await bcrypt.compare(password, existUser.password);
    if(!matches){
        return res.status(401).json({success: false, message: "Invalid Credentials", data: null});
    }

    let token = jwt.sign(
        {id: existUser.id, email: existUser.email},
        process.env.JWT_SECRET,
        {expiresIn: '7d'},
    )

    res.cookie("accessToken", token, {
         httpOnly: false,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            user:{
                id: existUser.id,
                username: existUser.username,
                email: existUser.email,
                fname: existUser.fname,
                lname: existUser.lname
            },
            
        }
    })
   }catch(error){
        return res.status(500).json({
            success: false,
            message: `Internal server error, user could not be verified ${error}`,
            data: null
        })
   }
    
}



const register = async(req,res)=>{
    try{
        const {username, email, password, fname, lname} = req.body;

    if(!username || !email || !password || !fname || !lname){
        return res.status(400).json({success: false, message: "All fields required", data: null});
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
        return res.status(409).json({success: false, message: "User already exists", data:null});
    }
    
    const hashpass = await bcrypt.hash(password, 10);
    
    
    
   
    const newUser = await prisma.user.create({
        data: { 
            username,
            email,
            password: hashpass,
            fname,
            lname
            
        },
    })


    const token = jwt.sign(
        {id: newUser.id, email: newUser.email},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    )

    res.cookie("accessToken", token, {
        httpOnly: false,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json({
        success: true,
        message: "user registered succesfully",
        data: {
            user:{
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                fname: newUser.fname,
                lname: newUser.lname
            },
            
        }
    });
    }catch(error){
        console.error("Register error: ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error, user could not be created",
            data: null
        })
    }
}

module.exports = {register, login}