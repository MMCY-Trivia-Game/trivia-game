<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Welcome Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome, Creator!</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <router-link 
            to="/creator/game/create"
            class="p-6 bg-highlight/10 rounded-xl hover:bg-highlight/20 transition-colors"
          >
            <h3 class="font-semibold text-highlight mb-2">Create New Game</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Start creating a new interactive game</p>
          </router-link>

          <router-link 
            to="/creator/games/my"
            class="p-6 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">My Games</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">View and manage your games</p>
          </router-link>

          <router-link 
            to="/creator/profile"
            class="p-6 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Profile</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage your creator profile</p>
          </router-link>
        </div>
      </div>

      <!-- Active Games Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Active Games</h2>
        <div class="space-y-4">
          <div v-if="activeGames.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
            No active games at the moment
          </div>
          <div
            v-for="game in activeGames"
            :key="game._id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">{{ game.title }}</h3>
              <p class="text-sm text-gray-500">Game Code: {{ game.game_code }}</p>
            </div>
            <div class="flex gap-2">
              <router-link
                :to="`/creator/game/${game._id}`"
                class="px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight/90"
              >
                Manage
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';

const activeGames = ref([]);

const fetchActiveGames = async () => {
  try {
    const response = await api.get('/api/games/creator/active');
    activeGames.value = response.data;
  } catch (error) {
    console.error('Error fetching active games:', error);
  }
};

onMounted(() => {
  fetchActiveGames();
});
</script>