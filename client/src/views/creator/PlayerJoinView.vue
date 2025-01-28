<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { io } from "socket.io-client";
import { useGamesStore } from "@/stores/creator/gamesStore";

const router = useRouter();
const socket = io("http://localhost:5000");
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
  ></div>

  <div class="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
      <h2 class="text-2xl font-semibold mb-4 text-secondary dark:text-white">
        Join Game
      </h2>
      <div>
        <label
          class="block text-sm font-medium text-secondary dark:text-white mb-1"
        >
          Game Code
        </label>
        <input
          v-model="gameCode"
          placeholder="Enter The Game Code"
          class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-secondary dark:text-white mb-1"
        >
          Your Name
        </label>
        <input
          v-model="playerName"
          type="text"
          class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 mb-3"
          placeholder="Enter your name"
          required
        />
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="submit"
          class="px-4 py-2 bg-[#F14A00] text-white rounded-lg hover:bg-[#F14A00]/90"
          @click="joinGame"
        >
          Join Game
        </button>
      </div>
    </div>
  </div>
</template>
