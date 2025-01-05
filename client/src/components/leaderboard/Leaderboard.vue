<!-- components/QuizLeaderboard.vue -->
<template>
  <aside>
    <h3 class="text-xl font-semibold mb-4 text-secondary dark:text-white">Leaderboard</h3>
    <div class="space-y-3">
      <div
        v-for="player in players"
        :key="player.rank"
        class="flex items-center justify-between p-3 rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg text-secondary dark:text-white"
      >
        <div class="flex items-center">
          <span class="text-[#F14A00] font-bold mr-3">#{{ player.rank }}</span>
          <span>{{ player.name }}</span>
        </div>
        <span>{{ player.score }}</span>
        <span>{{ player.Min }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
const players = [
  { rank: 1, name: 'chala', score: 2400 , Min:20},
  { rank: 2, name: 'Liam', score: 2100 , Min:30},
  { rank: 3, name: 'kiki', score: 1900, Min:35 },
  { rank: 4, name: 'Olivia', score: 1700 , Min:40},
  { rank: 5, name: 'Andi', score: 1600, Min:45 }
]
</script>