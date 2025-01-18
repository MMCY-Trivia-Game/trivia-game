const GameManager = require('../services/GameManager');
const { generateGameId } = require('../utils/helpers');

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle game creation
    socket.on('createGame', async (data) => {
      try {
        const gameId = generateGameId();
        const game = GameManager.createGame(gameId, socket.id, data.settings);
        
        socket.join(gameId);
        socket.emit('gameCreated', { 
          gameId,
          settings: game.settings
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle player joining
    socket.on('joinGame', async (data) => {
      try {
        const game = GameManager.addPlayer(data.gameId, socket.id, data.playerName);
        
        if (!game) {
          throw new Error('Game not found');
        }

        socket.join(data.gameId);
        socket.emit('gameJoined', {
          gameId: data.gameId,
          playerName: data.playerName
        });

        // Notify all players about new player
        io.to(data.gameId).emit('playerJoined', {
          playerName: data.playerName,
          players: Array.from(game.players.values()).map(p => p.name)
        });

        // Update leaderboard
        io.to(data.gameId).emit('leaderboard:update', 
          GameManager.getLeaderboard(data.gameId)
        );
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle answer submission
    socket.on('submitAnswer', (data) => {
      try {
        const result = GameManager.submitAnswer(
          data.gameId,
          socket.id,
          data.answer
        );

        if (result) {
          socket.emit('answerResult', {
            isCorrect: result.isCorrect,
            score: result.score
          });

          // Update leaderboard
          io.to(data.gameId).emit('leaderboard:update',
            GameManager.getLeaderboard(data.gameId)
          );
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle game start
    socket.on('startGame', async (data) => {
      try {
        const game = GameManager.games.get(data.gameId);
        
        if (!game || game.creatorId !== socket.id) {
          throw new Error('Unauthorized');
        }

        game.started = true;
        io.to(data.gameId).emit('gameStart', {
          totalQuestions: game.questions.length
        });

        // Send first question
        const questionData = GameManager.nextQuestion(data.gameId);
        io.to(data.gameId).emit('newQuestion', questionData);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle next question request
    socket.on('nextQuestion', (data) => {
      try {
        const game = GameManager.games.get(data.gameId);
        
        if (!game || game.creatorId !== socket.id) {
          throw new Error('Unauthorized');
        }

        const questionData = GameManager.nextQuestion(data.gameId);
        if (questionData) {
          io.to(data.gameId).emit('newQuestion', questionData);
        } else {
          io.to(data.gameId).emit('gameEnd', {
            leaderboard: GameManager.getLeaderboard(data.gameId)
          });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const gameId = GameManager.players.get(socket.id);
      if (gameId) {
        GameManager.removePlayer(gameId, socket.id);
        
        // Notify remaining players
        io.to(gameId).emit('playerLeft', {
          playerId: socket.id,
          leaderboard: GameManager.getLeaderboard(gameId)
        });
      }
    });
  });
}

module.exports = setupSocketHandlers;