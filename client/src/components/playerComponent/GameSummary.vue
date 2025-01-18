<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-2xl transform transition-all">
      <h2 class="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Game Complete!
      </h2>

      <!-- Player's Score -->
      <div class="text-center mb-8">
        <div class="text-6xl font-bold text-highlight mb-2">{{ playerScore }}</div>
        <div class="text-gray-600 dark:text-gray-400">Your Final Score</div>
      </div>

      <!-- Final Leaderboard -->
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Final Standings
        </h3>
        <div class="space-y-3">
          <TransitionGroup name="leaderboard">
            <div
              v-for="(player, index) in topPlayers"
              :key="player.id"
              class="flex items-center justify-between p-4 rounded-lg"
              :class="getPositionClass(index)"
            >
              <div class="flex items-center gap-4">
                <span class="text-2xl font-bold">#{{ index + 1 }}</span>
                <span class="font-medium">{{ player.name }}</span>
              </div>
              <span class="font-bold">{{ player.score }}</span>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center gap-4">
        <button
          @click="$emit('play-again')"
          class="px-6 py-3 bg-highlight text-white rounded-lg hover:bg-highlight/90 transition-colors"
        >
          Play Again
        </button>
        <button
          @click="$emit('exit')"
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Exit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  playerScore: Number,
  leaderboard: Array
});

const topPlayers = computed(() => 
  [...props.leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
);

const getPositionClass = (index) => {
  const classes = {
    0: 'bg-yellow-50 dark:bg-yellow-900/20',
    1: 'bg-gray-50 dark:bg-gray-700/20',
    2: 'bg-amber-50 dark:bg-amber-900/20'
  };
  return classes[index] || 'bg-white/5';
};

defineEmits(['play-again', 'exit']);
</script>

<style scoped>
.leaderboard-enter-active,
.leaderboard-leave-active {
  transition: all 0.5s ease;
}

.leaderboard-enter-from,
.leaderboard-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.leaderboard-move {
  transition: transform 0.5s ease;
}
</style> 