<script setup>
const props = defineProps({
  sortedPlayers: Array,
});
</script>

<template>
  <div>
    <header class="text-center mb-6">
      <h1 class="text-3xl font-bold text-white mb-2">Game Title</h1>
      <h1 class="text-xl font-bold text-gray-400 mb-6">Round: First</h1>
      <h1 class="text-3xl font-bold text-white">Leaderboard</h1>
    </header>

    <section class="flex justify-center items-center gap-6 mb-8">
      <div
        v-for="player in sortedPlayers.slice(0, 3)"
        :key="player.rank"
        class="flex flex-col items-center space-y-2"
        :class="{
          'order-1': player.rank === 2,
          'order-2': player.rank === 1,
          'order-3': player.rank === 3,
        }"
      >
        <div
          :class="[
            player.rank === 1
              ? 'w-28 h-28 md:w-40 md:h-40 text-6xl border-yellow-400'
              : player.rank === 2
              ? 'w-24 h-24 md:w-32 md:h-32 text-4xl border-gray-400'
              : 'w-20 h-20 md:w-24 md:h-24 text-2xl border-amber-900',
            'border-8 flex items-center justify-center bg-secondary text-white rounded-full font-bold shadow-lg relative',
          ]"
        >
          {{ player.name.charAt(0) }}
        </div>
        <p class="text-base md:text-lg font-semibold truncate">
          {{ player.name }}
        </p>
        <span class="text-base font-semibold px-2 rounded-full shadow-lg">
          {{ player.score }}
        </span>
      </div>
    </section>
    <section>
      <ul class="space-y-4">
        <li
          v-for="player in sortedPlayers.slice(3)"
          :key="player.rank"
          class="flex items-center justify-between bg-secondary px-4 py-3 rounded-lg shadow-md hover:bg-purple-950"
        >
          <div class="flex items-center space-x-4">
            <p class="text-lg font-semibold">{{ player.rank }}</p>
            <div
              class="w-10 h-10 flex items-center justify-center bg-tertiary text-white bg-primary rounded-full text-lg font-bold"
            >
              {{ player.name.charAt(0) }}
            </div>
            <p class="text-lg font-medium">{{ player.name }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <p class="text-lg font-semibold">{{ player.score }}</p>
            <svg
              v-if="player.trend === 'up'"
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>