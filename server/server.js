
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression")
const statusMonitor = require('express-status-monitor');

const authRouter = require("./src/routes/auth.routes");
const workspaceRouter = require("./src/routes/workspace.routes");
const userRouter = require("./src/routes/user.routes");
const cookieParser = require("cookie-parser");
const http = require('http');

const {Server} = require('socket.io');
const setupSocketHandler = require('./src/socket')

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};
const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: corsOptions});
app.use(statusMonitor( { websocket: io }));
app.use(compression());


app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter );
app.use('/api/user', userRouter );


app.get('/status', statusMonitor().pageRoute);

app.get('/', (req,res)=>{
    res.json({message: "server is live!"});
})
// app.listen(3000, ()=>{
//     console.log("listening on port 3000!");
// })

app.use((req,res)=>{
    res.status(404).json({message: "Route not found!"});
});

app.use((err, req,res, next)=>{
    console.log(err);
    res.status(500).json({message: "Internal Server Error"});
});





setupSocketHandler(io);

server.listen(3000, ()=>{
    console.log("Server with socketio listening ..");
})