<script setup>
import { onMounted, ref } from "vue";
import NavBar from "@/components/creator/NavBar.vue";
import Leaderboard from "@/components/creator/Leaderboard.vue";
import { useRouter, useRoute } from "vue-router";
import { useLeaderboardStore } from "@/stores/creator/leaderboardStore";
import { ArrowLongLeftIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const route = useRoute();
const leaderboardStore = useLeaderboardStore();

function goBack() {
  router.go(-1);
}

onMounted(() => {
  leaderboardStore.getLeaderboard();
});
</script>

<template>
  <div>
    <div class="min-h-screen bg-primary text-white">
      <NavBar />
      <button
        type="button"
        @click="goBack"
        class="text-white bg-primary hover:bg-primary font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        <ArrowLongLeftIcon class="w-10 h-10 text-gray-400 dark:text-gray-400" />
      </button>
      <div class="max-w-screen-md mx-auto p-6">
        <Leaderboard :sortedPlayers="leaderboardStore.leaderboard" />
      </div>
    </div>
  </div>
</template>
