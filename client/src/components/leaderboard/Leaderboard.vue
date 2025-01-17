<!-- components/QuizLeaderboard.vue -->
<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Leaderboard</h2>
    
    <!-- Live Players List -->
    <div class="space-y-4">
      <TransitionGroup name="leaderboard">
        <div
          v-for="(player, index) in sortedPlayers"
          :key="player.id"
          class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <!-- Rank -->
          <div class="w-8 h-8 flex items-center justify-center rounded-full" 
               :class="getRankClass(index)">
            {{ index + 1 }}
          </div>

          <!-- Player Info -->
          <div class="ml-4 flex-grow">
            <div class="font-medium text-gray-900 dark:text-white">
              {{ player.name }}
            </div>
            <div class="text-sm text-gray-500">
              {{ player.answeredQuestions || 0 }}/{{ totalQuestions }} questions
              <span class="ml-2">
                Avg: {{ formatTime(player.averageTime) }}
              </span>
            </div>
          </div>

          <!-- Score -->
          <div class="text-2xl font-bold text-highlight">
            {{ player.score }}
          </div>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="!sortedPlayers.length" class="text-center py-8 text-gray-500">
        No players yet
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameControlStore } from '@/stores/creator/gameControlStore';

const gameControlStore = useGameControlStore();
const { gameState } = gameControlStore;

const totalQuestions = computed(() => gameState.totalQuestions);

const sortedPlayers = computed(() => {
  return [...(gameState.players || [])]
    .sort((a, b) => b.score - a.score);
});

const getRankClass = (index) => {
  switch (index) {
    case 0:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 1:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
    case 2:
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    default:
      return 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
};

const formatTime = (seconds) => {
  if (!seconds) return '0s';
  return `${seconds.toFixed(1)}s`;
};
</script>

<style scoped>
.leaderboard-enter-active,
.leaderboard-leave-active {
  transition: all 0.3s ease;
}

.leaderboard-enter-from,
.leaderboard-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.leaderboard-move {
  transition: transform 0.3s ease;
}
</style>