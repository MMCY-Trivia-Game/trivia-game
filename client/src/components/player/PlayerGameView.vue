<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-3xl mx-auto">
      <!-- Waiting Room -->
      <div v-if="!gameState.isActive" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Waiting for game to start...
        </h2>
        <p class="text-gray-600 dark:text-gray-400">Game Code: {{ gameState.gameId }}</p>
        <div class="mt-6">
          <div class="inline-flex items-center gap-2 text-gray-500">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Connected
          </div>
        </div>
        <div v-if="!gameState.isActive" class="mt-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Players in Room ({{ gameState.players?.length || 0 }})
          </h3>
          <div class="space-y-2">
            <div
              v-for="player in gameState.players"
              :key="player.id"
              class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <span class="text-gray-700 dark:text-gray-200">{{ player.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Game -->
      <div v-else class="space-y-6">
        <!-- Question Display -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm text-gray-500">
              Question {{ gameState.currentQuestion + 1 }} of {{ gameState.totalQuestions }}
            </span>
            <span class="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {{ timeLeft }}s
            </span>
          </div>

          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {{ currentQuestion?.text }}
          </h2>

          <div class="space-y-3">
            <button
              v-for="option in currentQuestion?.options"
              :key="option.id"
              @click="submitAnswer(option.id)"
              :disabled="hasAnswered"
              :class="[
                'w-full p-4 text-left rounded-lg transition-colors',
                hasAnswered
                  ? option.id === selectedAnswer
                    ? 'bg-highlight text-white'
                    : 'bg-gray-100 dark:bg-gray-700'
                  : 'bg-white dark:bg-gray-700 hover:bg-highlight/10'
              ]"
            >
              {{ option.text }}
            </button>
          </div>
        </div>

        <!-- Score Display -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Your Score</h3>
          <div class="text-3xl font-bold text-highlight">
            {{ playerScore }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePlayerStore } from '@/stores/player/playerStore';

const playerStore = usePlayerStore();
const { gameState } = playerStore;

const timeLeft = ref(30);
const hasAnswered = ref(false);
const selectedAnswer = ref(null);
const playerScore = ref(0);

const currentQuestion = computed(() => {
  if (!gameState.questions || !gameState.questions.length) return null;
  return gameState.questions[gameState.currentQuestion];
});

const submitAnswer = (answerId) => {
  if (hasAnswered.value) return;
  
  selectedAnswer.value = answerId;
  hasAnswered.value = true;
  
  playerStore.submitAnswer({
    questionId: gameState.currentQuestion,
    answerId,
    timeSpent: 30 - timeLeft.value
  });
};

// Listen for game events
playerStore.socket?.on('questionResult', (data) => {
  playerScore.value = data.newScore;
  // Reset for next question
  setTimeout(() => {
    hasAnswered.value = false;
    selectedAnswer.value = null;
  }, 2000);
});

playerStore.socket?.on('nextQuestion', () => {
  hasAnswered.value = false;
  selectedAnswer.value = null;
  timeLeft.value = 30;
});
</script> 