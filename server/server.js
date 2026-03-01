require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRouter = require("./src/routes/auth.routes");
const workspaceRouter = require("./src/routes/workspace.routes");
const userRouter = require("./src/routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter );
app.use('/api/user', userRouter );

app.get('/', (req,res)=>{
    res.json({message: "server is live!"});
})
app.listen(3000, ()=>{
    console.log("listening on port 3000!");
})

app.use((req,res)=>{
    res.status(404).json({message: "Route not found!"});
});

app.use((err, req,res, next)=>{
    console.log(err);
    res.status(500).json({message: "Internal Server Error"});
});