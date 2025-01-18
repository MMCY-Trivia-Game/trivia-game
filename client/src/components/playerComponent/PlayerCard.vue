<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
    <!-- Question -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-white mb-2">{{ question }}</h2>
      <div class="w-full bg-white/20 rounded-full h-2">
        <div 
          class="bg-highlight h-2 rounded-full transition-all duration-1000"
          :style="{ width: `${(timeLeft / 30) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Options -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        v-for="option in options"
        :key="option.id"
        @click="submitAnswer(option.id)"
        class="bg-white/10 hover:bg-white/20 text-white p-4 rounded-lg transition-colors"
        :disabled="!isConnected"
      >
        {{ option.text }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  timeLeft: {
    type: Number,
    required: true
  },
  isConnected: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['submit-answer']);

const submitAnswer = (optionId) => {
  emit('submit-answer', optionId);
};
</script>