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
const adminRoute = require('./routes/adminRoutes');

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
app.use('/api/dashboard', adminRoute);

const gameRooms = {};
// Socket.IO connection for the leaderboard and realtime update
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('creatorJoin', async (gameCode) => {
    if (!gameCode) {
      socket.emit('error', 'Invalid gameCode or player data.');
      return;
    }

    socket.join(gameCode);
    console.log(`Creator joined game ${gameCode}`);
    // console.log(await io.in(gameCode).fetchSockets());
    console.log(socket.rooms);

    if (!gameRooms[gameCode]) {
      gameRooms[gameCode] = {
        creatorId: socket.id,
        players: [],
        questionIndex: 0,
        leaderboard: [],
        answers: [],
      };
      // console.log('if not');
    }
  });

  socket.on('joinGame', async (gameCode, player) => {
    if (!gameCode || !player || !player.name) {
      socket.emit('error', 'Invalid gameCode or player data.');
      return;
    }

    console.log(`Player ${player.name} joined game ${gameCode}`);
    socket.join(gameCode);

    if (!gameRooms[gameCode]) {
      gameRooms[gameCode] = {
        creatorId: null,
        players: [],
        questionIndex: 0,
        leaderboard: [],
        answers: [],
      };
      console.log('if not');
    }
    // console.log(gameRooms[gameCode]);

    if (!gameRooms[gameCode].players.some((p) => p.socketId === socket.id)) {
      gameRooms[gameCode].players.push({
        player,
        socketId: socket.id,
        score: 0,
      });
      io.to(gameCode).emit('playerJoined', gameRooms[gameCode]);

      // io.emit('playerJoined', gameRooms[gameCode]);
      // console.log(gameRooms[gameCode]);
      // console.log(await io.in(gameCode).fetchSockets());
      console.log(socket.rooms);
    }
  });

  socket.on('startGame', (gameCode) => {
    console.log(`Game ${gameCode} started`);
    io.to(gameCode).emit('gameStarted');
  });

  socket.on('leaderboardUpdate', (data) => {
    io.to(`game:${data.gameId}`).emit('leaderboard:update', data);
  });

  socket.on('answerQuestion', ({ gameCode, playerId, userName, answer }) => {
    const game = gameRooms[gameCode];
    if (!game) return;

    const player = game.players.find((p) => p.socketId === playerId);
    if (!player) return;

    game.answers.push({ playerId, answer });

    if (game.answers.length <= 3) {
      const bonusPoints = [30, 20, 10];
      player.score += bonusPoints[game.answers.length - 1];
    }

    if (game.answers.length === game.players.length) {
      emitQuestionResults(gameCode);
    }
  });

  const emitQuestionResults = (gameCode) => {
    const game = gameRooms[gameCode];
    if (!game) return;

    const correctAnswer = 'CorrectAnswerHere';
    const analytics = game.answers.reduce(
      (stats, { answer }) => {
        stats[answer] = (stats[answer] || 0) + 1;
        return stats;
      },
      { correctAnswer }
    );
    io.to(gameCode).emit('questionResults', {
      analytics,
      leaderboard: game.players.sort((a, b) => b.score - a.score),
    });

    game.answers = [];
    game.questionIndex++;
  };

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
