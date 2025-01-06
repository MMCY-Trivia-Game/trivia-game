<script setup>
import { useGamesStore } from "@/stores/creator/gamesStore";
import GameCard from "@/components/creator/GameCard.vue";

const gamesStore = useGamesStore();
</script>

<template>
  <div>
    <div
      v-for="(category, index) in gamesStore.categories"
      :key="index"
      class="mb-10"
    >
      <h4 class="text-2xl font-semibold text-white mb-4 dark:text-white">
        {{ category }}
      </h4>
      <div class="flex gap-4 overflow-x-auto scrollbar-hide">
        <GameCard
          v-for="(game, index) in gamesStore.getGamesByCategory(category)"
          :key="index"
          :game="game"
        />
      </div>
    </div>
  </div>
</template>