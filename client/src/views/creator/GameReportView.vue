<script setup>
import { computed, ref } from "vue";
import { Bar } from "vue-chartjs";
import QuestionWithoutAnswerCard from "@/components/creator/QuestionWithoutAnswerCard.vue";
import AnswerAnalyticsWithGraph from "@/components/creator/AnswerAnalyticsWithGraph.vue";
import router from "@/router/route";

const currentQuestion = ref({
  text: "What is the capital of France?",
  options: ["Berlin", "Madrid", "Paris", "Rome"],
  correctOption: 2,
  answers: [2, 5, 8, 0],
  noAnswer: 1,
});

const leaderboard = ref([
  { name: "Alice", score: 20 },
  { name: "Charlie", score: 10 },
  { name: "Bob", score: 15 },
  { name: "Daisy", score: 5 },
]);

const startNextQuestion = () => {
  router.push("/creator/game/start");
};
</script>

<template>
  <div class="min-h-screen bg-primary text-white p-6">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Game Report</h1>
      <button
        @click="startNextQuestion"
        class="px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-purple-950"
      >
        Next Question
      </button>
    </header>

    <QuestionWithoutAnswerCard :question="currentQuestion" />

    <AnswerAnalyticsWithGraph :question="currentQuestion" />

    <section>
      <h2 class="text-2xl font-semibold mb-4">Leaderboard</h2>
      <ul class="space-y-4">
        <li
          v-for="(player, index) in leaderboard.sort(
            (a, b) => b.score - a.score
          )"
          :key="index"
          class="flex justify-between items-center bg-secondary px-4 py-3 rounded-lg shadow-md"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full text-lg font-bold"
            >
              {{ player.name.charAt(0) }}
            </div>
            <p class="text-lg font-medium">{{ player.name }}</p>
          </div>
          <p class="text-lg font-bold">{{ player.score }} pts</p>
        </li>
      </ul>
    </section>
  </div>
</template>
