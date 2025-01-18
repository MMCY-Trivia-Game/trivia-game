<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Create Game Section -->
      <div class="bg-white p-6 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold mb-4">Create Test Game</h2>
        <button 
          @click="createTestGame" 
          class="px-4 py-2 bg-highlight text-white rounded-lg"
        >
          Create New Game
        </button>
        
        <!-- Game Code Display -->
        <div v-if="gameCode" class="mt-4">
          <p class="text-lg">Game Code: <span class="font-mono font-bold">{{ gameCode }}</span></p>
          <p class="text-sm text-gray-600">Use this code to join the game</p>
        </div>
      </div>

      <!-- Game Control Panel -->
      <div v-if="createdGame" class="bg-white p-6 rounded-xl shadow-lg">
        <h3 class="text-xl font-bold mb-4">Game Controls</h3>
        
        <!-- Player List -->
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Connected Players:</h4>
          <div class="space-y-2">
            <div v-for="player in players" :key="player.id" 
                 class="p-2 bg-gray-50 rounded flex items-center">
              <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              {{ player.name }}
            </div>
          </div>
        </div>

        <!-- Control Buttons -->
        <div class="flex gap-4">
          <button 
            @click="startGame" 
            class="px-4 py-2 bg-primary text-white rounded-lg"
            :disabled="!socket || createdGame.is_active"
          >
            Start Game
          </button>
          <button 
            @click="endGame" 
            class="px-4 py-2 bg-red-500 text-white rounded-lg"
            :disabled="!socket || !createdGame.is_active"
          >
            End Game
          </button>
          <button 
            v-if="createdGame?.is_active"
            @click="nextQuestion" 
            class="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Next Question
          </button>
        </div>
      </div>

      <!-- Debug Info -->
      <div v-if="createdGame" class="bg-white p-6 rounded-xl shadow-lg">
        <h3 class="font-semibold mb-2">Game Details:</h3>
        <pre class="bg-gray-50 p-4 rounded overflow-auto">{{ createdGame }}</pre>
      </div>

      <!-- Add current question display -->
      <div v-if="createdGame?.is_active" class="mt-4">
        <p class="text-lg">Current Question: {{ currentQuestionIndex + 1 }} / {{ createdGame.questions.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useGameControlStore } from '@/stores/creator/gameControlStore';
import api from '@/plugins/axios';

const gameControlStore = useGameControlStore();
const createdGame = ref(null);
const gameCode = ref('');
const players = ref([]);
const socket = ref(null);
const currentQuestionIndex = ref(0);

const createTestGame = async () => {
  try {
    const testGame = {
      title: "Test Quiz",
      questions: [
        {
          text: "What is 2 + 2?",
          options: [
            { id: 1, text: "3" },
            { id: 2, text: "4" },
            { id: 3, text: "5" },
            { id: 4, text: "6" }
          ],
          correctOptionId: 2
        },
        {
          text: "What color is the sky?",
          options: [
            { id: 1, text: "Red" },
            { id: 2, text: "Green" },
            { id: 3, text: "Blue" },
            { id: 4, text: "Yellow" }
          ],
          correctOptionId: 3
        }
      ]
    };

    // Create the game
    const response = await api.post('/api/games/create', testGame);
    createdGame.value = response.data;
    gameCode.value = response.data.game_code;
    console.log('Game created:', response.data);

    // Initialize socket and store reference
    socket.value = await gameControlStore.initSocket();
    
    if (!socket.value) {
      throw new Error('Failed to initialize socket');
    }

    // Add event listeners
    socket.value.on('playerJoined', (data) => {
      console.log('Player joined:', data);
      const existingPlayer = players.value.find(p => p.id === data.player.id);
      if (!existingPlayer) {
        players.value.push(data.player);
      }
    });

    socket.value.on('gameStarted', (data) => {
      console.log('Game started:', data);
      if (createdGame.value) {
        createdGame.value.is_active = true;
        currentQuestionIndex.value = 0; // Reset question index
      }
    });

    socket.value.on('gameEnded', (data) => {
      console.log('Game ended:', data);
      if (createdGame.value) {
        createdGame.value.is_active = false;
        currentQuestionIndex.value = 0; // Reset question index
      }
    });

    // Join as creator
    socket.value.emit('joinAsCreator', { gameId: gameCode.value });

  } catch (error) {
    console.error('Error:', error);
  }
};

const startGame = () => {
  try {
    if (!socket.value) {
      console.error('Socket not initialized');
      return;
    }
    if (!gameCode.value) {
      console.error('No game code available');
      return;
    }
    console.log('Starting game:', gameCode.value);
    socket.value.emit('startGame', { gameId: gameCode.value });
  } catch (error) {
    console.error('Error starting game:', error);
  }
};

const endGame = () => {
  try {
    if (!socket.value) {
      console.error('Socket not initialized');
      return;
    }
    if (!gameCode.value) {
      console.error('No game code available');
      return;
    }
    console.log('Ending game:', gameCode.value);
    socket.value.emit('endGame', { gameId: gameCode.value });
  } catch (error) {
    console.error('Error ending game:', error);
  }
};

const nextQuestion = () => {
  try {
    if (!socket.value || !gameCode.value) {
      console.error('Socket or game code not available');
      return;
    }

    if (currentQuestionIndex.value < createdGame.value.questions.length - 1) {
      currentQuestionIndex.value++;
      console.log('Moving to next question:', currentQuestionIndex.value);
      socket.value.emit('nextQuestion', { 
        gameId: gameCode.value,
        questionNumber: currentQuestionIndex.value
      });
    } else {
      console.log('No more questions, ending game');
      endGame();
    }
  } catch (error) {
    console.error('Error moving to next question:', error);
  }
};

// Cleanup on component unmount
onUnmounted(() => {
  if (socket.value) {
    socket.value.removeAllListeners();
    socket.value.disconnect();
  }
});
</script> 