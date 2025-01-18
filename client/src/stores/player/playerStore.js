import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';

export const usePlayerStore = defineStore('player', () => {
  const socket = ref(null);
  const gameState = ref({
    isConnected: false,
    isActive: false,
    gameId: null,
    gameStatus: 'waiting',
    currentQuestion: 0,
    timeLeft: 0,
    questions: [],
    currentOptions: [],
    players: [],
    totalQuestions: 0,
    score: 0
  });

  const initSocket = () => {
    if (!socket.value) {
      console.log('Initializing socket connection...');
      socket.value = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      socket.value.on('connect', () => {
        console.log('Socket connected:', socket.value.id);
        gameState.value.isConnected = true;
      });

      socket.value.on('gameState', (state) => {
        console.log('Received game state:', state);
        gameState.value = {
          ...gameState.value,
          ...state,
          isConnected: true,
          isActive: state.gameStatus === 'active'
        };
      });

      socket.value.on('playerJoined', (data) => {
        console.log('Player joined event:', data);
        if (!gameState.value.players) {
          gameState.value.players = [];
        }
        const existingPlayer = gameState.value.players.find(p => p.id === data.player.id);
        if (!existingPlayer) {
          gameState.value.players.push(data.player);
        }
      });

      socket.value.on('gameStarting', () => {
        console.log('Game is starting...');
        gameState.value.gameStatus = 'starting';
      });

      socket.value.on('gameStarted', (data) => {
        console.log('Game started:', data);
        gameState.value = {
          ...gameState.value,
          isActive: true,
          gameStatus: 'active',
          currentQuestion: data.currentQuestion,
          questions: data.questions,
          totalQuestions: data.totalQuestions
        };
      });

      socket.value.on('nextQuestion', (data) => {
        console.log('Next question received:', data);
        gameState.value = {
          ...gameState.value,
          currentQuestion: data.questionNumber,
          currentOptions: data.question.options
        };
      });

      socket.value.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
  };

  const joinGame = (gameCode, playerName) => {
    if (socket.value) {
      console.log('Emitting joinGame:', { gameId: gameCode, playerName });
      socket.value.emit('joinGame', { gameId: gameCode, playerName });
      gameState.value.gameId = gameCode;
    } else {
      console.error('Socket not initialized');
    }
  };

  const leaveGame = () => {
    if (socket.value && gameState.value.gameId) {
      socket.value.emit('leaveGame', {
        gameId: gameState.value.gameId,
        playerId: socket.value.id
      });
      socket.value.disconnect();
      socket.value = null;
      gameState.value.isConnected = false;
      gameState.value.gameId = null;
    }
  };

  return {
    gameState,
    socket,
    initSocket,
    joinGame,
    leaveGame
  };
}); 