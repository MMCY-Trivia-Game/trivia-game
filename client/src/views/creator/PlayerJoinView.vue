<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import { useGamesStore } from "@/stores/creator/gamesStore";

const router = useRouter();
const socket = io("http://192.168.8.210:5000");
const gamesStore = useGamesStore();

const gameCode = ref("");
const playerName = ref("");

const joinGame = async () => {
  if (gameCode.value && playerName.value) {
    gamesStore.joinGame(gameCode.value, { name: playerName.value });
    router.push(`/game/${gameCode.value}/lobby`);
    // router.push(`/game/${gameCode.value}/play`);
    // gamesStore.listenForPlayersUpdates();
    // console.log(gamesStore.players);
  }
};

onMounted(() => {
  gamesStore.listenForPlayersUpdates();
});
</script>

<template>
  <div
    class="min-h-screen bg-primary text-white p-6 flex flex-col justify-center items-center"
  >
    <div class="max-w-screen-lg mx-auto p-6 text-center">
      <RouterLink
        to="#"
        class="flex items-center space-x-3 rtl:space-x-reverse justify-center mb-4"
      >
        <img
          src="@/assets/logo-highlight.png"
          class="h-16"
          alt="mtrivia Logo"
        />
      </RouterLink>
      <h1 class="text-3xl font-bold mb-6">Join Game</h1>
      <input
        v-model="gameCode"
        placeholder="Enter Game Code"
        class="w-full px-4 py-2 mb-4 bg-secondary rounded-lg"
      />
      <input
        v-model="playerName"
        placeholder="Enter Your Name"
        class="w-full px-4 py-2 mb-4 bg-secondary rounded-lg"
      />
      <button @click="joinGame" class="px-6 py-3 bg-green-500 rounded-lg">
        Join
      </button>
    </div>
  </div>
</template>
