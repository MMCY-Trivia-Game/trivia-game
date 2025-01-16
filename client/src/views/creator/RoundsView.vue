<script setup>
import NavBar from "@/components/creator/NavBar.vue";
import { useRouter, useRoute } from "vue-router";
import { ArrowLongLeftIcon } from "@heroicons/vue/24/solid";
import { onMounted } from "vue";
import { useLeaderboardStore } from "@/stores/creator/leaderboardStore";

const leaderboardStore = useLeaderboardStore();
const router = useRouter();
const route = useRoute();

function goBack() {
  router.go(-1);
}

const handleSelection = (index) => {
  leaderboardStore.setSelectedRoundIndex(index);
  router.push(`/creator/game/${route.params.id}/leaderboard`);
};

onMounted(() => {
  leaderboardStore.getLeaderboards(route.params.id);
  console.log(leaderboardStore.roundsList);
});
</script>

<template>
  <div>
    <div class="bg-primary min-h-screen">
      <NavBar />
      <div class="max-w-screen-xl mx-auto p-6">
        <button
          type="button"
          @click="goBack"
          class="text-white bg-primary hover:bg-primary font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          <ArrowLongLeftIcon
            class="w-10 h-10 text-gray-400 dark:text-gray-400"
          />
        </button>
        <ul class="text-center">
          <h1 class="text-2xl font-semibold text-white mb-4 dark:text-white">
            Select Round
          </h1>
          <li
            v-for="(round, index) in leaderboardStore.roundsList"
            :key="index"
          >
            <button
              type="button"
              @click="handleSelection(index)"
              class="text-white bg-secondary hover:bg-indigo-900 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-secondary dark:hover:bg-indigo-900"
            >
              Round {{ round }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
