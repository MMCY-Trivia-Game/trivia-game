<template>
  <header class="flex justify-between items-center mb-8">
    <button class="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-secondary dark:text-white">
      <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg> -->
    </button>
    <h1 class="text-lg font-semibold text-white dark:text-white ">
      Question {{ currentQuestion }}/{{ totalQuestions }}
    </h1>
    <button @click="$emit('toggle-dark')" class="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-secondary dark:text-white">
      <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  </header>
</template>

<script setup>
defineProps({
  currentQuestion: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  isDark: {
    type: Boolean,
    required: true
  }
})

defineEmits(['toggle-dark'])
</script>