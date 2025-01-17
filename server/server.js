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
const Game = require('./models/gameModel');

connectDB();
const app = express();
const httpServer = createServer(app);

// Configure Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/api/games', gameRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', adminRoute);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinGame', async ({ gameId, playerName }) => {
    try {
      console.log('Join game attempt:', { gameId, playerName });
      const game = await Game.findOne({ game_code: gameId });
      
      if (!game) {
        console.log('Game not found:', gameId);
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      // Join the game room
      socket.join(gameId);
      console.log(`${playerName} (${socket.id}) joined game room: ${gameId}`);
      
      // Add player to game state
      const player = {
        id: socket.id,
        name: playerName,
        score: 0
      };

      // Update game in database
      await Game.findOneAndUpdate(
        { game_code: gameId },
        { $push: { players: player } }
      );

      // Emit to all clients in the room
      io.to(gameId).emit('playerJoined', { player });
      
      // Send current game state to the new player
      socket.emit('gameState', {
        gameId,
        gameStatus: game.is_active ? 'active' : 'waiting',
        players: game.players,
        questions: game.questions
      });

    } catch (error) {
      console.error('Error joining game:', error);
      socket.emit('error', { message: 'Failed to join game' });
    }
  });

  socket.on('startGame', async ({ gameId }) => {
    try {
      console.log('Starting game:', gameId);
      const game = await Game.findOne({ game_code: gameId });
      if (!game) {
        console.log('Game not found:', gameId);
        return;
      }

      // Activate the game
      await Game.findOneAndUpdate(
        { game_code: gameId },
        { 
          is_active: true,
          current_question: 0
        }
      );

      const gameData = {
        totalQuestions: game.questions.length,
        currentQuestion: 0,
        questions: game.questions.map(q => ({
          text: q.text,
          options: q.options,
          timeLimit: q.timeLimit
        })),
        gameStatus: 'active',
        isActive: true
      };

      // Notify all players
      io.to(gameId).emit('gameStarted', gameData);
      console.log('Game started successfully:', gameId);

    } catch (error) {
      console.error('Error starting game:', error);
      socket.emit('error', { message: 'Failed to start game' });
    }
  });

  socket.on('submitAnswer', async ({ gameId, playerId, answer, questionId, timeSpent }) => {
    try {
      const game = await Game.findOne({ game_code: gameId });
      if (!game) return;

      const question = game.questions[questionId];
      const isCorrect = question.correctOptionId === answer;
      
      // Calculate score based on time taken
      const maxScore = 100;
      const timeBonus = Math.max(0, 1 - (timeSpent / question.timeLimit));
      const score = isCorrect ? Math.round(maxScore * (0.7 + 0.3 * timeBonus)) : 0;

      // Update player's score and time
      await Game.findOneAndUpdate(
        { 
          game_code: gameId,
          'players.id': playerId 
        },
        { 
          $inc: { 
            'players.$.score': score,
            'players.$.totalTimeSpent': timeSpent
          },
          $push: { 
            'players.$.answers': {
              questionId,
              answerId: answer,
              isCorrect,
              timeSpent,
              score
            }
          }
        }
      );

      // Send result to the player
      socket.emit('questionResult', {
        isCorrect,
        correctAnswer: question.correctOptionId,
        score,
        timeSpent
      });

      // Update leaderboard
      const updatedGame = await Game.findOne({ game_code: gameId });
      io.to(gameId).emit('leaderboardUpdate', {
        players: updatedGame.players.map(p => ({
          ...p,
          averageTime: p.totalTimeSpent / (p.answers?.length || 1)
        }))
      });

    } catch (error) {
      console.error('Error processing answer:', error);
      socket.emit('error', { message: 'Failed to process answer' });
    }
  });

  socket.on('nextQuestion', async ({ gameId, questionNumber }) => {
    try {
      console.log('Moving to next question:', { gameId, questionNumber });
      const game = await Game.findOne({ game_code: gameId });
      if (!game) {
        console.log('Game not found:', gameId);
        return;
      }

      // Update current question in database
      await Game.findOneAndUpdate(
        { game_code: gameId },
        { current_question: questionNumber }
      );

      const questionData = {
        questionNumber,
        question: {
          text: game.questions[questionNumber].text,
          options: game.questions[questionNumber].options,
          timeLimit: game.questions[questionNumber].timeLimit
        }
      };

      // Send next question to all players
      io.to(gameId).emit('nextQuestion', questionData);
      console.log('Next question sent to players:', questionData);

    } catch (error) {
      console.error('Error moving to next question:', error);
      socket.emit('error', { message: 'Failed to move to next question' });
    }
  });

  socket.on('endGame', async ({ gameId }) => {
    try {
      const game = await Game.findOne({ game_code: gameId });
      if (!game) return;

      // Deactivate the game
      await Game.findOneAndUpdate(
        { game_code: gameId },
        { is_active: false }
      );

      // Send final results to all players
      io.to(gameId).emit('gameEnded', {
        players: game.players,
        finalScores: game.players.map(p => ({
          id: p.id,
          name: p.name,
          score: p.score
        }))
      });

    } catch (error) {
      console.error('Error ending game:', error);
      socket.emit('error', { message: 'Failed to end game' });
    }
  });

  socket.on('joinAsCreator', ({ gameId }) => {
    console.log('Creator joining game room:', gameId);
    socket.join(gameId);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
