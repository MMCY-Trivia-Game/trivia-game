<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import router from "@/router/route";
import Spinner from "@/components/creator/Spinner.vue";
import { useQuestionsStore } from "@/stores/creator/questionsStore";
import { useGamesStore } from "@/stores/creator/gamesStore";

const route = useRoute();
const questionsStore = useQuestionsStore();
const gamesStore = useGamesStore();

const countdown = ref(3);
const timeRemaining = ref(0);
const isCountdownRunning = ref(true);
const isQuestionActive = ref(false);
const answeredPlayers = ref(0);

const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60);
  const seconds = timeRemaining.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
});

const startGameCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(interval);
      startQuestion();
    }
  }, 1000);
};

const startQuestion = () => {
  isCountdownRunning.value = false;
  isQuestionActive.value = true;
  timeRemaining.value =
    questionsStore.questions[questionsStore.currentQuestionIndex].timeLimit;

  const interval = setInterval(() => {
    timeRemaining.value--;
    if (timeRemaining.value <= 0) {
      clearInterval(interval);
      // endQuestion();
      router.push(`/game/${gamesStore.selectedGame._id}/lobby`);
    }
  }, 1000);

  // simulatePlayerResponses();
};

const answerQuestion = (option, index) => {
  gamesStore.answerQuestion(option, index);
  gamesStore.incrementAnsweredPlayers();
  router.push(`/game/${gamesStore.selectedGame._id}/lobby`);
};

onMounted(() => {
  gamesStore.listenForPlayersUpdates();
  startGameCountdown();
});
</script>

<template>
  <div
    class="min-h-screen bg-primary text-white p-6 flex flex-col justify-center items-center"
  >
    <div
      v-if="isCountdownRunning"
      class="absolute top-1/2 left-1/2 translation -translate-y-1/2 -translate-x-1/2"
    >
      <p
        class="text-9xl font-extrabold text-white animate-bounce transition-transform transform scale-100 duration-500"
      >
        {{ countdown }}
      </p>
    </div>
    <div class="max-w-screen-lg mx-auto p-6">
      <div v-if="isQuestionActive" class="w-full px-6">
        <div class="text-center mb-6">
          <p class="text-lg font-semibold">Time Remaining</p>
          <p class="text-4xl font-bold">{{ formattedTime }}</p>
        </div>

        <h1 class="text-3xl font-bold mb-6">
          {{
            questionsStore.questions[questionsStore.currentQuestionIndex].text
          }}
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
    </div>
  </div>
</template>
