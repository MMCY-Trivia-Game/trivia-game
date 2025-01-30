<script setup>
import { useGamesStore } from "@/stores/creator/gamesStore";

const gamesStore = useGamesStore();
</script>

<template>
  <section>
    <h2 class="text-2xl font-semibold mb-4">Leaderboard</h2>
    <ul class="space-y-4">
      <li
        v-for="player in gamesStore.players.sort((a, b) => b.score - a.score)"
        :key="player.socketId"
        class="flex justify-between items-center bg-secondary px-4 py-3 rounded-lg shadow-md"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full text-lg font-bold"
          >
            {{ player.player.name.charAt(0) }}
          </div>
          <p class="text-lg font-medium">{{ player.player.name }}</p>
        </div>
        <p class="text-lg font-bold">{{ player.score }} pts</p>
      </li>
    </ul>
  </section>
</template>