<script setup>
import { onMounted, ref } from "vue";
import QRCodeVue from "qrcode.vue";
import { useRoute } from "vue-router";
import { useGamesStore } from "@/stores/creator/gamesStore";

const route = useRoute();
const gamesStore = useGamesStore();

const startGame = () => {
  gamesStore.startGame();
};

onMounted(async () => {
  await gamesStore.getGameById(route.params.id);
  gamesStore.creatorJoin();
  gamesStore.listenForPlayersUpdates();
  gamesStore.listenForUpdateCreatorSide();
});
</script>

<template>
  <div>
    <div class="min-h-screen bg-primary text-white">
      <div class="max-w-screen-lg mx-auto p-6">
        <header class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white">
            {{ gamesStore.selectedGame.title }}
          </h1>
        </header>

        <section
          class="flex flex-col md:flex-row justify-around items-center p-6 gap-6 bg-secondary rounded-xl"
        >
          <div class="text-center">
            <p class="text-lg font-semibold">Game Code</p>
            <div
              class="flex items-center justify-center bg-none rounded-lg text-5xl font-bold"
            >
              {{ gamesStore.selectedGame.game_code }}
            </div>
          </div>

          <div class="bg-secondary rounded-lg shadow-lg">
            <div class="bg-white p-2 rounded-lg shadow-lg">
              <QRCodeVue
                :value="`http://localhost:3000/${gamesStore.selectedGame.game_code}`"
                size="150"
                fgColor="#ffffff"
                bgColor="#2A004E"
                class="rounded-lg"
              />
            </div>
          </div>

          <div class="text-center">
            <p class="text-lg font-semibold">Players Joined</p>
            <p class="text-4xl font-bold">{{ gamesStore.players.length }}</p>
          </div>
        </section>

        <section class="mt-8">
          <h2 class="text-2xl font-semibold mb-4">List of Players</h2>
          <ul
            class="space-y-4 bg-secondary rounded-lg px-6 py-5 overflow-y-auto max-h-96"
          >
            <li
              v-for="player in gamesStore.players"
              :key="player.name"
              class="flex items-center justify-center rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <p class="text-lg font-medium">{{ player.player.name }}</p>
              </div>
            </li>
          </ul>
        </section>

        <div class="text-center mt-8">
          <button
            @click="startGame"
            class="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
