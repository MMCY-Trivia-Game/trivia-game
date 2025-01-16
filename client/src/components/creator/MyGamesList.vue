<script setup>
import { useGamesStore } from "@/stores/creator/gamesStore";
import GameCard from "@/components/creator/GameCard.vue";
import Spinner from "@/components/creator/Spinner.vue";
import { onMounted } from "vue";

const gamesStore = useGamesStore();

onMounted(() => {
  gamesStore.getMyGames();
});
</script>

<template>
  <div class="flex justify-center">
    <div
      class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <Spinner v-if="gamesStore.loading" />
      <GameCard
        v-else
        v-for="game in gamesStore.games"
        :key="game._id"
        :game="game"
      />
    </div>
  </div>
</template>