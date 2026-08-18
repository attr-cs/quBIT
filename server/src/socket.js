const jwt = require('jsonwebtoken');

const mysock = (io)=> {
    io.on('connection', (socket)=>{
        console.log("[SOCKET] User connected:", socket.id);

        socket.on('hello',(data)=>{
            console.log("[SOCKET] Received hello from client:", data?.message);
            socket.emit('welcome', { message: 'helo from server'});
        })

        socket.on('disconnect', ()=>{
            console.log('[SOCKET] User disconnected:', socket.id);
        });

        socket.on('error', (err) => {
            console.error('[SOCKET] Socket error:', err);
        });
    });
};

module.exports = mysock;