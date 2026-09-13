const jwt = require('jsonwebtoken');
const prisma = require('../db/db');

const mysock = (io) => {
  io.on('connection', (socket) => {
    console.log('[SOCKET] User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('[SOCKET] User disconnected:', socket.id);
    });
  });
};

module.exports = mysock;