<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import Spinner from "@/components/creator/Spinner.vue";
import { useQuestionsStore } from "@/stores/creator/questionsStore";
import { useGamesStore } from "@/stores/creator/gamesStore";

const route = useRoute();
const questionsStore = useQuestionsStore();
const gamesStore = useGamesStore();

const answerQuestion = (option, index) => {
  gamesStore.answerQuestion(option, index);
};
</script>

<template>
  <div
    class="min-h-screen bg-primary text-white p-6 flex flex-col justify-center items-center"
  >
    <h1 class="text-3xl font-bold mb-6">
      {{ questionsStore.questions[questionsStore.currentQuestionIndex].text }}
    </h1>
    <div class="space-y-4">
      <button
        v-for="(op, index) in questionsStore.questions[
          questionsStore.currentQuestionIndex
        ].option"
        :key="op"
        @click="answerQuestion(op, index)"
        class="w-full px-4 py-2 bg-secondary rounded-lg"
      >
        {{ op }}
      </button>
    </div>
  </div>
</template>
