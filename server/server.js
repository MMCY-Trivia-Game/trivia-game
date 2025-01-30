require('dotenv').config();
const path = require('path');
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
    origin: '*',
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
const BONUS_SCORES = [30, 20, 10];
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
        answersCount: {},
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
        answersCount: {},
      };
      console.log('if not');
    }

    if (!gameRooms[gameCode].players.some((p) => p.socketId === socket.id)) {
      gameRooms[gameCode].players.push({
        player,
        socketId: socket.id,
        score: 0,
      });
      io.to(gameCode).emit('playerJoined', gameRooms[gameCode]);

      console.log(socket.rooms);
    }
  });

  socket.on('startGame', (gameCode, id) => {
    console.log(`Game ${gameCode} started`);

    // const game = gameRooms[gameCode];

    // game.answersCount = new Array(optionsLength).fill(0);
    io.to(gameCode).emit('gameStarted', id);
  });

  socket.on('endGame', (gameCode) => {
    if (gameRooms[gameCode]) {
      delete gameRooms[gameCode];
      io.to(gameCode).emit('gameEnded');
    }
    console.log(gameRooms);
  });

  socket.on('nextQuestion', (gameCode, optionsLength) => {
    const game = gameRooms[gameCode];
    game.questionIndex += 1;

    game.answers = [];
    game.answersCount = {};
    // game.answersCount = new Array(optionsLength).fill(0);

    io.to(gameCode).emit('nextQuestion', game.questionIndex);
  });

  socket.on('answerCountInitialization', (gameCode, optionsLength) => {
    const game = gameRooms[gameCode];
    // game.questionIndex += 1;

    // game.answers = [];
    // game.answersCount = new Array(optionsLength).fill(0);
    console.log('Answer count initialized:', game.answersCount);
  });

  socket.on('leaderboardUpdate', (data) => {
    io.to(`game:${data.gameId}`).emit('leaderboard:update', data);
  });

  socket.on(
    'answerQuestion',
    ({ gameCode, playerId, answer, answeredCorrectly, index }) => {
      const game = gameRooms[gameCode];
      if (!game) return;

      const player = game.players.find((p) => p.socketId === playerId);
      if (!player) {
        console.log('Player not found');
        return;
      }

      const answerLength = game.answers.length;

      console.log('Answered correctly:', answeredCorrectly);
      if (answeredCorrectly) {
        player.score += 10;

        if (answerLength >= 0 && answerLength <= 2) {
          player.score += BONUS_SCORES[answerLength];
        }
      }

      game.answers.push({ playerId, answer, timestamp: Date.now() });

      game.answers.sort((a, b) => a.timestamp - b.timestamp);

      if (!game.answersCount[index]) {
        game.answersCount[index] = 0;
      }

      game.answersCount[index] += 1;

      const playersWhoDidNotAnswer = game.players.length - game.answers.length;

      // if (game.answers.length <= 3) {
      //   const bonusPoints = [30, 20, 10];
      //   player.score += bonusPoints[game.answers.length - 1];
      // }
      // game.answers.forEach((answer, index) => {
      //   const player = game.players.find((p) => p.socketId === answer.playerId);
      //   if (player) {
      //     player.score += 10; // Base score for answering
      //     if (index < BONUS_SCORES.length) {
      //       player.score += BONUS_SCORES[index]; // Add bonus score
      //     }
      //   }
      // });

      io.to(gameCode).emit(
        'updateScores',
        game.players,
        game.answersCount,
        playersWhoDidNotAnswer
      );

      // if (game.answers.length === game.players.length) {
      //   emitQuestionResults(gameCode);
      // }
    }
  );

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

    // game.answers = [];
    // game.questionIndex++;
  };

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  // app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  // const __dirname = path.resolve();
  // app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  // app.get('/', (req, res) => {
  //   res.send('API is running....');
  // });
}

const port = process.env.PORT || 5000;
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}/`);
});
