<script setup>
import { ref } from "vue";
import NavBar from "@/components/creator/NavBar.vue";
import Leaderboard from "@/components/creator/Leaderboard.vue";

const players = ref([
  { name: "Sam Black", score: 1500, rank: 2 },
  { name: "Jane Smith", score: 1800, rank: 1 },
  { name: "Jessica Cher", score: 1400, rank: 3 },
  { name: "Theresa Webb", score: 1500, rank: 5, trend: "down" },
  { name: "Darlene Robertson", score: 1500, rank: 4, trend: "up" },
  { name: "Floyd Miles", score: 1500, rank: 6, trend: "down" },
  { name: "Annette Black", score: 1500, rank: 7, trend: "up" },
]);

const sortedPlayers = ref(players.value.sort((a, b) => a.rank - b.rank));
</script>

<template>
  <div>
    <div class="min-h-screen bg-primary text-white">
      <NavBar />
      <div class="max-w-screen-md mx-auto p-6">
        <Leaderboard :sortedPlayers="sortedPlayers" />
      </div>
    </div>
  </div>
</template>
