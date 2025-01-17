import { defineStore } from 'pinia';
import { ref } from 'vue';
import { io } from 'socket.io-client';

export const useGameControlStore = defineStore('gameControl', () => {
  const socket = ref(null);
  const gameState = ref({
    gameId: null,
    isActive: false,
    isPaused: false,
    currentQuestion: 0,
    totalQuestions: 0,
    questions: [],
    players: [],
    leaderboard: [],
    isConnected: false
  });

  const initSocket = () => {
    return new Promise((resolve, reject) => {
      try {
        if (!socket.value) {
          console.log('Initializing creator socket connection...');
          socket.value = io(import.meta.env.VITE_API_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling']
          });

          socket.value.on('connect', () => {
            console.log('Creator connected to game server');
            gameState.value.isConnected = true;
            resolve(socket.value);
          });

          socket.value.on('error', (error) => {
            console.error('Socket error:', error);
            reject(error);
          });

          socket.value.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            reject(error);
          });

          socket.value.on('disconnect', () => {
            console.log('Creator disconnected from game server');
            gameState.value.isConnected = false;
          });
        } else {
          resolve(socket.value);
        }
      } catch (error) {
        console.error('Socket initialization error:', error);
        reject(error);
      }
    });
  };

  const startGame = async (gameId) => {
    if (!socket.value) {
      console.error('Socket not initialized');
      return;
    }
    console.log('Starting game:', gameId);
    gameState.value.gameId = gameId;
    socket.value.emit('startGame', { gameId });
  };

  const setGameQuestions = (questions) => {
    gameState.value.questions = questions;
    gameState.value.totalQuestions = questions.length;
  };

  const endGame = (gameId) => {
    if (!socket.value) {
      console.error('Socket not initialized');
      return;
    }
    console.log('Ending game:', gameId);
    socket.value.emit('endGame', { gameId });
    gameState.value.isActive = false;
  };

  return {
    gameState,
    socket,
    initSocket,
    startGame,
    endGame,
    setGameQuestions
  };
}); 