<script setup>
import { useGamesStore } from "@/stores/creator/gamesStore";
import { onMounted, ref } from "vue";

const players = ref([]);

onMounted(() => {
  const gamesStore = useGamesStore();
  gamesStore.listenForPlayersUpdates();
  players.value = gamesStore.players;
});
</script>

<template>
  <div class="bg-gray-600">
    <div class="text-center">
      <p class="text-lg font-semibold">Players Joined</p>
      <p class="text-4xl font-bold">{{ players.length }}</p>
    </div>
    <section class="mt-8">
      <h2 class="text-2xl font-semibold mb-4">List of Players</h2>
      <ul
        class="space-y-4 bg-secondary rounded-lg px-6 py-5 overflow-y-auto max-h-96"
      >
        <li
          v-for="player in players"
          :key="player.name"
          class="flex items-center justify-center rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <p class="text-lg font-medium">{{ player.player.name }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>