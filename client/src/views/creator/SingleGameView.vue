<script setup>
import NavBar from "@/components/creator/NavBar.vue";
import QuestionsList from "@/components/creator/QuestionsList.vue";
import { useGamesStore } from "@/stores/creator/gamesStore";
import { useQuestionsStore } from "@/stores/creator/questionsStore";
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const questionsStore = useQuestionsStore();
const gamesStore = useGamesStore();
onMounted(() => {
  questionsStore.getQuestionsByGameId(route.params.id);
});
</script>

<template>
  <div>
    <div class="bg-primary min-h-screen">
      <NavBar />
      <div class="max-w-screen-xl mx-auto p-6">
        <div class="flex justify-between md:flex-row flex-col">
          <div>
            <h4 class="text-4xl font-semibold text-white mb-4 dark:text-white">
              {{ gamesStore.selectedGame.title }}
            </h4>
            <p className="text-lg font-medium text-gray-400 truncate mt-2">
              By: {{ gamesStore?.selectedGame?.creator_id?.first_name }}
              {{ gamesStore?.selectedGame?.creator_id?.last_name }}
            </p>
            <p className="text-md font-light text-gray-400 truncate mb-6">
              Category:
              {{
                gamesStore?.selectedGame?.category
                  ?.substring(0, 1)
                  .toUpperCase()
              }}{{
                gamesStore?.selectedGame?.category?.substring(
                  1,
                  gamesStore?.selectedGame?.category?.length
                )
              }}
            </p>
          </div>
          <div class="flex gap-4">
            <RouterLink
              :to="`/creator/game/${gamesStore.selectedGame._id}/rounds`"
              class="h-16 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-secondary hover:bg-purple-950 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              Leaderboard
            </RouterLink>
            <RouterLink
              :to="`/creator/game/${gamesStore.selectedGame._id}/lobby`"
              class="h-16 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-secondary hover:bg-purple-950 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              Play Trivia
            </RouterLink>
          </div>
        </div>
        <hr class="h-px my-5 bg-gray-400 border-0 dark:bg-gray-700" />
        <QuestionsList :questions="questionsStore.questions" />
      </div>
    </div>
  </div>
</template>