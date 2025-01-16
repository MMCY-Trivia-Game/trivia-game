<script setup>
import { useGamesStore } from "@/stores/creator/gamesStore";
import GameCard from "@/components/creator/GameCard.vue";
import { onMounted, ref, shallowRef } from "vue";

const gamesStore = useGamesStore();
const categories = ref([]);
const gamesByCategory = ref({});

const fetchGamesByCategory = async () => {
  try {
    const gamesPromises = await gamesStore.categories.map((cat) =>
      gamesStore.getGamesByCategory(cat)
    );
    const gamesResults = await Promise.all(gamesPromises);

    const nonEmptyCategories = [];
    gamesStore.categories.forEach((category, index) => {
      const games = gamesResults[index];
      if (games && games.length > 0) {
        nonEmptyCategories.push(category);
        gamesByCategory.value[category] = games;
      }
    });

    categories.value = nonEmptyCategories;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchGamesByCategory();
});
</script>

<template>
  <div>
    <div v-for="(category, index) in categories" :key="index" class="mb-10">
      <h4 class="text-2xl font-semibold text-white mb-4 dark:text-white">
        {{ category }}
      </h4>
      <div class="flex gap-4 overflow-x-auto scrollbar-hide">
        <GameCard
          v-for="game in gamesByCategory[category]"
          :key="game._id"
          :game="game"
        />
      </div>
    </div>
  </div>
</template>