<script setup>
import { onMounted } from "vue";
import { useLeaderboardStore } from "@/stores/creator/leaderboardStore";

const leaderboardStore = useLeaderboardStore();

onMounted(() => {
  leaderboardStore.getLeaderboards(route.params.id);
});
</script>

<template>
  <div>
    <ul>
      <li v-for="(round, index) in leaderboardStore.rounds" :key="index">
        {{ round }}
      </li>
    </ul>
  </div>
</template>