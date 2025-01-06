<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  game: Object,
});
</script>

<template>
  <RouterLink
    :to="`/creator/game/${game._id}`"
    class="flex-shrink-0 w-72 relative block max-w-sm p-6 bg-secondary border border-gray-400 rounded-lg shadow-lg overflow-hidden hover:bg-primary dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-shadow duration-300"
  >
    <h5
      class="mb-2 text-xl font-bold tracking-tight text-white dark:text-white truncate"
    >
      {{ game.title }}
    </h5>
    <p className="text-sm text-gray-400 truncate">By John Doe</p>
  </RouterLink>
</template>