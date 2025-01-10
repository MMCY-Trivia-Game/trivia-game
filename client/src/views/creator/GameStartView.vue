<script setup>
import { ref, onMounted, watch, computed } from "vue";
import QuestionWithoutAnswerCard from "@/components/creator/QuestionWithoutAnswerCard.vue";
import router from "@/router/route";
const gameDetails = ref({
  title: "Trivia Challenge",
  players: [
    { name: "Alice", answered: false },
    { name: "Bob", answered: false },
    { name: "Charlie", answered: false },
    { name: "Daisy", answered: false },
  ],
  question: {
    text: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctOption: 2,
    timeLimit: 10,
  },
});

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

const simulatePlayerResponses = () => {
  gameDetails.value.players.forEach((player, index) => {
    setTimeout(() => {
      if (!player.answered) {
        player.answered = true;
        answeredPlayers.value++;
      }
    }, Math.random() * gameDetails.value.question.timeLimit * 1000);
  });
};

watch(answeredPlayers, (newCount) => {
  if (newCount === gameDetails.value.players.length && isQuestionActive.value) {
    endQuestion();
  }
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
  timeRemaining.value = gameDetails.value.question.timeLimit;

  const interval = setInterval(() => {
    timeRemaining.value--;
    if (timeRemaining.value <= 0) {
      clearInterval(interval);
      endQuestion();
    }
  }, 1000);

  simulatePlayerResponses();
};

const endQuestion = () => {
  isQuestionActive.value = false;
  router.push("/creator/game/report");
};

onMounted(() => {
  startGameCountdown();
});
</script>

<template>
  <div class="min-h-screen bg-primary text-white">
    <div class="max-w-screen-xl mx-auto p-6">
      <header class="text-center mb-6">
        <h1 class="text-3xl font-bold text-white">{{ gameDetails.title }}</h1>
      </header>

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

      <div v-if="isQuestionActive" class="w-full px-6">
        <div class="text-center mb-6">
          <p class="text-lg font-semibold">Time Remaining</p>
          <p class="text-4xl font-bold">{{ formattedTime }}</p>
        </div>

        <QuestionWithoutAnswerCard :question="gameDetails.question" />

        <div class="mt-8">
          <p class="text-lg font-semibold">Players Answered</p>
          <p class="text-4xl font-bold">
            {{ answeredPlayers }} / {{ gameDetails.players.length }}
          </p>

          <ul class="mt-4 space-y-2">
            <li
              v-for="player in gameDetails.players"
              :key="player.name"
              class="flex justify-between items-center bg-secondary px-4 py-3 rounded-lg"
            >
              <p class="text-lg">{{ player.name }}</p>
              <p
                class="text-lg font-medium"
                :class="player.answered ? 'text-green-500' : 'text-red-500'"
              >
                {{ player.answered ? "Answered" : "Not Answered" }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

