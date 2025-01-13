require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const questionRoutes = require('./routes/questionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoute = require('./routes/adminRoutes')


connectDB(); // connect DB
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// middleware
app.use(cors());
app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', adminRoute)
// Socket.IO connection for the leaderboard and realtime update
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinGame', (gameId, userName) => {
    socket.join(`${gameId}`);
    io.to(gameCode).emit('playerJoined', { playerId: socket.id, userName });
  });

  socket.on('leaderboardUpdate', (data) => {
    io.to(`game:${data.gameId}`).emit('leaderboard:update', data);
  });

  socket.on('answerQuestion', ({ gameCode, playerId, userName, answer }) => {
    console.log(`Player ${playerId} answered question in game ${gameCode}`);
    io.to(gameCode).emit('playerAnswered', { playerId, userName, answer });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
