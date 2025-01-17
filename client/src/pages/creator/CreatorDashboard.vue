<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Game Creator Dashboard</h1>
        <button
          @click="createNewGame"
          class="px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight/90"
        >
          Create New Game
        </button>
      </div>

      <!-- Active Game Panel -->
      <GameControlPanel v-if="activeGame" />

      <!-- Games List -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Your Games</h2>
        <div class="space-y-4">
          <div
            v-for="game in games"
            :key="game._id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">{{ game.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Code: {{ game.game_code }} | Questions: {{ game.questions.length }}
              </p>
            </div>
            <div class="flex gap-2">
              <button
                @click="startGame(game)"
                class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                :disabled="game.is_active"
              >
                {{ game.is_active ? 'Active' : 'Start' }}
              </button>
              <button
                @click="viewResults(game)"
                class="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Results
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Results Modal -->
      <GameResults
        v-if="showResults"
        :results="selectedGameResults"
        @close="showResults = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGameControlStore } from '@/stores/creator/gameControlStore';
import GameControlPanel from '@/components/creator/GameControlPanel.vue';
import GameResults from '@/components/creator/GameResults.vue';
import api from '@/plugins/axios';

const gameControlStore = useGameControlStore();
const games = ref([]);
const activeGame = ref(null);
const showResults = ref(false);
const selectedGameResults = ref([]);

const fetchGames = async () => {
  try {
    const response = await api.get('/api/games/creator');
    games.value = response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
  }
};

const createNewGame = async () => {
  try {
    const response = await api.post('/api/games/create', {
      title: 'New Game',
      questions: [] // You might want to add a question creation flow
    });
    await fetchGames();
  } catch (error) {
    console.error('Error creating game:', error);
  }
};

const startGame = async (game) => {
  try {
    activeGame.value = game;
    gameControlStore.gameState.gameId = game.game_code;
    gameControlStore.setGameQuestions(game.questions);
    await api.put(`/api/games/activate/${game._id}`);
    gameControlStore.initSocket();
  } catch (error) {
    console.error('Error starting game:', error);
  }
};

const viewResults = async (game) => {
  try {
    const response = await api.get(`/api/games/${game._id}/results`);
    selectedGameResults.value = response.data;
    showResults.value = true;
  } catch (error) {
    console.error('Error fetching game results:', error);
  }
};

onMounted(() => {
  fetchGames();
});
</script> 