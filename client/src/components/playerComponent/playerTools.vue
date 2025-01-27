<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <button
      v-for="(tool, index) in tools"
      :key="index"
      class="p-4 rounded-xl bg-[#F14A00] text-white hover:bg-[#F14A00]/90 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <span class="block text-lg mb-1">{{ tool.icon }}</span>
      <span class="text-xs opacity-80">{{ tool.desc }}</span>
    </button>
  </div>
</template>

<script setup>
const tools = [
  { icon: 'Leave ', desc: 'Quit the game' },
]
</script>