<template>
  <div class="backdrop-blur-lg bg-white/30 dark:bg-black/30 rounded-3xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
    <h2 class="text-2xl font-semibold mb-6 text-center text-secondary dark:text-white">
     what is the capital city of Ethiopia?
    </h2>
    
    <div class="mb-8">
      <div class="flex justify-between text-sm mb-2 text-secondary dark:text-white">
        <span>Time Remaining</span>
        <span>{{ timeLeft }}:00</span>
      </div>
      <div class="h-1 w-full bg-primary/20 dark:bg-white/20 rounded-full overflow-hidden">
        <div 
          class="h-full bg-[#F14A00] animate-[timer_10s_linear_forwards]"
          :style="{ width: `${(timeLeft/10)*100}%` }"
        />
      </div>
    </div>

    <div class="space-y-4">
      <button
        v-for="(option, index) in options"
        :key="index"
        class="w-full p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#F14A00] text-secondary dark:text-white"
      >
        <span class="font-semibold mr-2">{{ String.fromCharCode(65 + index) }}.</span> {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  timeLeft: {
    type: Number,
    required: true
  }
})

const options = ref(['Addis Ababa', 'Kenya', 'Italy', 'south Africa'])
</script>