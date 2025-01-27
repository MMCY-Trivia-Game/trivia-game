<template>
  <div class="flex flex-col items-center w-16 mt-20">
    <div v-for="index in totalQuestions" :key="index" class="relative">
      <div :class="[
        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1',
        index === currentQuestion ? 'bg-[#F14A00] text-white' : 
        index < currentQuestion ? 'bg-white/30 text-white' : 
        'bg-white/10 text-white/50'
      ]">
        {{ index }}
      </div>
      <div v-if="index < totalQuestions" :class="[
        'w-0.5 h-12 mx-auto',
        index < currentQuestion ? 'bg-white/30' : 'bg-white/10'
      ]" />
    </div>
  </div>
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
  }
})
</script>