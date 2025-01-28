<script setup>
import { useGamesStore } from "@/stores/creator/gamesStore";
import { onMounted, ref, computed } from "vue";
import { TransitionGroup } from 'vue'

const players = ref([]);
const gamesStore = useGamesStore();

onMounted(() => {
  gamesStore.listenForPlayersUpdates();
  gamesStore.listenForUpdatePlayerSide();
  players.value = gamesStore.players;
});

const playerCount = computed(() => gamesStore.players.length);
</script>

<template>
  <div class="bg-primary min-h-screen p-8 text-white">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold mb-4">Player Lobby</h1>
        <div class="text-6xl font-extrabold text-highlight transition-all duration-300 ease-in-out" 
             :class="{ 'scale-110': playerCount > 0 }">
          {{ playerCount }}
        </div>
        <p class="text-accent mt-2">Players Joined</p>
      </div>
      
      <div class="bg-secondary rounded-lg p-6 shadow-lg">
        <h2 class="text-xl font-semibold mb-4 text-highlight">Players</h2>
        <TransitionGroup 
          name="list" 
          tag="ul"
          class="space-y-2 max-h-96 overflow-y-auto"
        >
          <li
            v-for="player in gamesStore.players"
            :key="player.player.name"
            class="bg-primary rounded-lg p-3 flex items-center justify-between transition-all duration-300 ease-in-out hover:bg-accent hover:text-white"
          >
            <span class="text-lg">{{ player.player.name }}</span>
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
          </li>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #2A004E;
}

::-webkit-scrollbar-thumb {
  background: #F14A00;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #C62300;
}
</style>