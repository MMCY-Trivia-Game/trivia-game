<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Game Results</h2>

    <!-- Overall Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <div class="text-4xl font-bold text-highlight mb-2">{{ totalPlayers }}</div>
        <div class="text-gray-600 dark:text-gray-400">Players</div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <div class="text-4xl font-bold text-highlight mb-2">{{ averageScore.toFixed(1) }}</div>
        <div class="text-gray-600 dark:text-gray-400">Avg Score</div>
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <div class="text-4xl font-bold text-highlight mb-2">{{ completionRate }}%</div>
        <div class="text-gray-600 dark:text-gray-400">Completion Rate</div>
      </div>
    </div>

    <!-- Question-by-Question Analysis -->
    <div class="space-y-6">
      <div
        v-for="(result, index) in results"
        :key="index"
        class="border dark:border-gray-700 rounded-lg p-4"
      >
        <h3 class="font-semibold text-gray-800 dark:text-white mb-4">
          Question {{ index + 1 }}: {{ result.question }}
        </h3>
        <div class="space-y-3">
          <div
            v-for="option in result.options"
            :key="option.id"
            class="flex items-center gap-4"
          >
            <div class="w-1/3">{{ option.text }}</div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-1000"
                  :class="option.id === result.correctOptionId ? 'bg-green-500' : 'bg-red-500'"
                  :style="{ width: `${(option.count / totalPlayers) * 100}%` }"
                ></div>
              </div>
            </div>
            <div class="w-16 text-right">
              {{ ((option.count / totalPlayers) * 100).toFixed(1) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  results: {
    type: Array,
    required: true
  }
});

const totalPlayers = computed(() => {
  return props.results[0]?.totalPlayers || 0;
});

const averageScore = computed(() => {
  const scores = props.results.map(r => r.correctAnswers);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
});

const completionRate = computed(() => {
  const completed = props.results.filter(r => r.answersReceived === totalPlayers.value).length;
  return ((completed / props.results.length) * 100).toFixed(1);
});
</script> 