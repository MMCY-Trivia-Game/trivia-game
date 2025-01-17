<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
    <!-- Game Status Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Game Control</h2>
        <p v-if="gameState.gameId" class="text-gray-600 dark:text-gray-400">
          Game Code: <span class="font-mono font-bold">{{ gameState.gameId }}</span>
        </p>
      </div>
      <div class="flex gap-3">
        <button
          v-if="!gameState.isActive"
          @click="startGame"
          class="px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight/90"
          :disabled="!gameState.players || gameState.players.length === 0"
        >
          Start Game
        </button>
        <button
          v-else-if="!gameState.isPaused"
          @click="pauseGame"
          class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Pause
        </button>
        <button
          v-else
          @click="resumeGame"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Resume
        </button>
      </div>
    </div>

    <!-- Game Progress -->
    <div v-if="gameState.isActive" class="mb-6">
      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>Question {{ gameState.currentQuestion + 1 }} of {{ gameState.totalQuestions }}</span>
        <span>{{ timeLeft }}s</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-highlight transition-all duration-1000"
          :style="{ width: `${((gameState.currentQuestion + 1) / gameState.totalQuestions) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Players List -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Connected Players ({{ gameState.players?.length || 0 }})
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <TransitionGroup name="players">
          <div
            v-for="player in gameState.players"
            :key="player.id"
            class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-center gap-2"
          >
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <span class="text-gray-700 dark:text-gray-200">{{ player.name }}</span>
            <span class="ml-auto text-sm text-gray-500">{{ player.score || 0 }}</span>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Current Question Display -->
    <div v-if="currentQuestion" class="border-t dark:border-gray-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Current Question</h3>
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <p class="text-gray-800 dark:text-white mb-4">{{ currentQuestion.text }}</p>
        <div class="space-y-2">
          <div
            v-for="option in currentQuestion.options"
            :key="option.id"
            :class="[
              'p-3 rounded-lg',
              option.id === currentQuestion.correctOptionId
                ? 'bg-green-100 dark:bg-green-900/20 border border-green-500'
                : 'bg-white dark:bg-gray-600'
            ]"
          >
            {{ option.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useGameControlStore } from '@/stores/creator/gameControlStore';

const gameControlStore = useGameControlStore();
const { gameState } = gameControlStore;
const timeLeft = ref(30);
let timer = null;

const currentQuestion = computed(() => {
  if (!gameState.questions || !gameState.questions.length) return null;
  return gameState.questions[gameState.currentQuestion];
});

const startGame = async () => {
  await gameControlStore.startGame();
  startTimer();
};

const pauseGame = () => {
  gameControlStore.pauseGame();
  clearInterval(timer);
};

const resumeGame = () => {
  gameControlStore.resumeGame();
  startTimer();
};

const startTimer = () => {
  clearInterval(timer);
  timeLeft.value = 30;
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      gameControlStore.nextQuestion();
    }
  }, 1000);
};

onMounted(() => {
  if (gameState.isActive && !gameState.isPaused) {
    startTimer();
  }
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.players-enter-active,
.players-leave-active {
  transition: all 0.3s ease;
}

.players-enter-from,
.players-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.players-move {
  transition: transform 0.3s ease;
}
</style> 