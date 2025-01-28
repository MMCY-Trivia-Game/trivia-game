<script setup>
import { computed, onMounted, ref } from "vue";
import QuestionWithoutAnswerCard from "@/components/creator/QuestionWithoutAnswerCard.vue";
import AnswerAnalyticsWithGraph from "@/components/creator/AnswerAnalyticsWithGraph.vue";
import router from "@/router/route";
import { useQuestionsStore } from "@/stores/creator/questionsStore";
import { useGamesStore } from "@/stores/creator/gamesStore";

const questionsStore = useQuestionsStore();
const gamesStore = useGamesStore();

const lastQuestion = ref(false);

const currentQuestion = ref({});
// const currentQuestion = ref({
//   text: "What is the capital of France?",
//   options: ["Berlin", "Madrid", "Paris", "Rome"],
//   correctOption: 2,
//   answers: [2, 5, 8, 0],
//   noAnswer: 1,
// });

// const leaderboard = ref([
//   { name: "Alice", score: 20 },
//   { name: "Charlie", score: 10 },
//   { name: "Bob", score: 15 },
//   { name: "Daisy", score: 5 },
// ]);

const endGame = () => {
  gamesStore.endGame();
  router.push(`/creator/game/${gamesStore.selectedGame._id}/report/final`);
};

const startNextQuestion = () => {
  // questionsStore.incrementQuestionIndex();
  // if(lastQuestion.value) {
  //   router.push(`/creator/game/${gamesStore.selectedGame._id}/start`);
  // }
  gamesStore.nextQuestion();
  // router.push(`/creator/game/${gamesStore.selectedGame._id}/start`);
};

onMounted(async () => {
  // currentQuestion.value = gamesStore.getQuestionAnalysis();
  // await gamesStore.getQuestionAnalysis();
});
</script>

<template>
  <div class="min-h-screen bg-primary text-white p-6">
    <div class="max-w-screen-xl mx-auto p-6">
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-white">Game Report</h1>
        <div v-if="!gamesStore.gameEnded">
          <button
            v-if="questionsStore.lastQuestion"
            @click="startNextQuestion"
            class="px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-purple-950"
          >
            Last Question
          </button>
          <button
            v-else
            @click="startNextQuestion"
            class="px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-purple-950"
          >
            Next Question
          </button>
        </div>
        <button
          v-else
          @click="endGame"
          class="px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-purple-950"
        >
          End Game
        </button>
      </header>

      <QuestionWithoutAnswerCard
        :question="
          questionsStore.questions[questionsStore.currentQuestionIndex]
        "
      />

      <AnswerAnalyticsWithGraph :question="gamesStore.questionAnalysis" />

      <section>
        <h2 class="text-2xl font-semibold mb-4">Leaderboard</h2>
        <ul class="space-y-4">
          <li
            v-for="player in gamesStore.players.sort(
              (a, b) => b.score - a.score
            )"
            :key="player.socketId"
            class="flex justify-between items-center bg-secondary px-4 py-3 rounded-lg shadow-md"
          >
            <div class="flex items-center space-x-4">
              <div
                class="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full text-lg font-bold"
              >
                {{ player.player.name.charAt(0) }}
              </div>
              <p class="text-lg font-medium">{{ player.player.name }}</p>
            </div>
            <p class="text-lg font-bold">{{ player.score }} pts</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
