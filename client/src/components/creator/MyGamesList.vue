<script setup>
import { useGamesStore } from "@/stores/creator/gamesStore";
import GameCard from "@/components/creator/GameCard.vue";

const gamesStore = useGamesStore();
</script>

<template>
  <div class="flex justify-center">
    <div
      class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <GameCard
        v-for="(game, index) in gamesStore.games"
        :key="index"
        :game="game"
      />
    </div>
  </div>
</template>