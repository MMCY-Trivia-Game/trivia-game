const { Server } = require('socket.io');

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  return io;
};

const handleGameControl = (io, socket, gameStates) => {
  socket.on('startGame', async ({ gameId, timePerQuestion }) => {
    try {
      const gameState = gameStates.get(gameId);
      if (!gameState) return;

      gameState.status = 'active';
      gameState.timePerQuestion = timePerQuestion;
      gameState.startTime = Date.now();

      // Notify all players that game is starting
      io.to(gameId).emit('gameStart', {
        totalQuestions: gameState.questions.length,
        timePerQuestion
      });

      // Start first question after 3 seconds
      setTimeout(() => {
        sendNextQuestion(io, gameId, gameState);
      }, 3000);

    } catch (error) {
      console.error('Error starting game:', error);
    }
  });

  socket.on('nextQuestion', ({ gameId }) => {
    const gameState = gameStates.get(gameId);
    if (!gameState) return;

    sendNextQuestion(io, gameId, gameState);
  });

  socket.on('pauseGame', ({ gameId }) => {
    const gameState = gameStates.get(gameId);
    if (!gameState) return;

    gameState.isPaused = true;
    io.to(gameId).emit('gamePaused');
  });

  socket.on('resumeGame', ({ gameId }) => {
    const gameState = gameStates.get(gameId);
    if (!gameState) return;

    gameState.isPaused = false;
    io.to(gameId).emit('gameResumed');
  });
};

const handleReconnection = (io, socket, gameStates) => {
  socket.on('reconnectAttempt', async ({ gameId, playerId, playerName }) => {
    try {
      const gameState = gameStates.get(gameId);
      if (!gameState) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }

      // Check if player was in the game
      const existingPlayer = gameState.players.find(p => p.id === playerId);
      if (!existingPlayer) {
        socket.emit('error', { message: 'Player not found in game' });
        return;
      }

      // Rejoin game room
      socket.join(gameId);

      // Send current game state
      socket.emit('gameStateSync', {
        currentQuestion: gameState.currentQuestion,
        timeLeft: calculateRemainingTime(gameState),
        question: getCurrentQuestion(gameState),
        leaderboard: gameState.leaderboard,
        status: gameState.status
      });

    } catch (error) {
      console.error('Error handling reconnection:', error);
      socket.emit('error', { message: 'Failed to reconnect' });
    }
  });
};

const calculateRemainingTime = (gameState) => {
  if (!gameState.questionStartTime) return 0;
  const elapsed = (Date.now() - gameState.questionStartTime) / 1000;
  return Math.max(0, gameState.timePerQuestion - elapsed);
};

const getCurrentQuestion = (gameState) => {
  if (!gameState.questions || !gameState.questions[gameState.currentQuestion]) {
    return null;
  }
  return {
    number: gameState.currentQuestion + 1,
    ...gameState.questions[gameState.currentQuestion]
  };
};

const sendNextQuestion = (io, gameId, gameState) => {
  const currentQuestionIndex = gameState.currentQuestion;
  const question = gameState.questions[currentQuestionIndex];

  if (!question) {
    gameState.status = 'finished';
    io.to(gameId).emit('gameEnd', {
      leaderboard: gameState.leaderboard
    });
    return;
  }

  // Set question start time
  gameState.questionStartTime = Date.now();

  io.to(gameId).emit('newQuestion', {
    questionNumber: currentQuestionIndex + 1,
    question: question.text,
    options: question.options,
    timeLimit: gameState.timePerQuestion,
    serverTime: gameState.questionStartTime
  });

  setTimeout(() => {
    if (gameState.status === 'active' && !gameState.isPaused) {
      handleQuestionTimeout(io, gameId, gameState);
    }
  }, gameState.timePerQuestion * 1000);
};

const handleQuestionTimeout = (io, gameId, gameState) => {
  // Process unanswered as incorrect
  const currentQuestionIndex = gameState.currentQuestion;
  gameState.currentQuestion++;

  io.to(gameId).emit('questionEnded', {
    questionNumber: currentQuestionIndex + 1,
    correctAnswer: gameState.questions[currentQuestionIndex].correctOptionId
  });
};

module.exports = {
  configureSocket,
  handleGameControl,
  handleReconnection
};