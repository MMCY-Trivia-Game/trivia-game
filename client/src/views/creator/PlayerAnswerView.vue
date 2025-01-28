<!-- <script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import Spinner from "@/components/creator/Spinner.vue";
import { useQuestionsStore } from "@/stores/creator/questionsStore";
import { useGamesStore } from "@/stores/creator/gamesStore";

const route = useRoute();
const questionsStore = useQuestionsStore();
const gamesStore = useGamesStore();

const selectedAnswer = ref(null);
const countdown = ref(3);
const timeRemaining = ref(0);
const isCountdownRunning = ref(true);
const isQuestionActive = ref(false);
const socket = io(); // Initialize Socket.IO

const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60);
  const seconds = timeRemaining.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const startGameCountdown = () => {
  isCountdownRunning.value = true;
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
  timeRemaining.value = questionsStore.questions[questionsStore.currentQuestionIndex].timeLimit;

  const interval = setInterval(() => {
    timeRemaining.value--;
    if (timeRemaining.value <= 0) {
      clearInterval(interval);
      endQuestion();
    }
  }, 1000);
};

const endQuestion = () => {
  isQuestionActive.value = false;
  selectedAnswer.value = null;
};

const answerQuestion = (option, index) => {
  if (selectedAnswer.value === null) {
    selectedAnswer.value = index;
    gamesStore.answerQuestion(option, index);
    gamesStore.incrementAnsweredPlayers();
    
    // Emit the answer to the server
    socket.emit('player_answer', { option, index });
  }
};

// Watch for changes in the current question index
watch(() => questionsStore.currentQuestionIndex, () => {
  selectedAnswer.value = null;
  startGameCountdown();
});

onMounted(() => {
  // Listen for 'next_question' event from the server
  socket.on('next_question', () => {
    selectedAnswer.value = null;
    startGameCountdown();
  });
  
  // Listen for 'sync_time' event to keep in sync with creator's timer
  socket.on('sync_time', (remainingTime) => {
    timeRemaining.value = remainingTime;
  });

  // Initial countdown when component mounts
  startGameCountdown();
});

onUnmounted(() => {
  // Clean up Socket.IO listeners
  socket.off('next_question');
  socket.off('sync_time');
});
</script>

<template>
  <div class="min-h-screen bg-primary text-white">
    <div class="max-w-screen-xl mx-auto p-6">
      <header class="text-center mb-6">
        <h1 class="text-3xl font-bold text-white">
          {{ gamesStore.selectedGame.title }}
        </h1>
      </header>

      <div
        v-if="isCountdownRunning"
        class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
      >
        <p
          class="text-9xl font-extrabold text-white animate-bounce transition-transform transform scale-100 duration-500"
        >
          {{ countdown }}
        </p>
      </div>

      <div v-if="isQuestionActive" class="w-full max-w-2xl mx-auto bg-secondary rounded-lg shadow-lg p-8 transition-all duration-300">
        <div class="text-center mb-6">
          <p class="text-lg font-semibold">Time Remaining</p>
          <p class="text-4xl font-bold">{{ formattedTime }}</p>
        </div>

        <h1 class="text-3xl font-bold mb-8 text-center text-white">
          {{ questionsStore.questions[questionsStore.currentQuestionIndex].text }}
        </h1>
        <div class="space-y-4">
          <button
            v-for="(op, index) in questionsStore.questions[questionsStore.currentQuestionIndex].option"
            :key="op"
            @click="answerQuestion(op, index)"
            :class="[
              'w-full px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-300',
              selectedAnswer === index
                ? 'bg-highlight text-primary'
                : 'bg-primary text-white hover:bg-accent'
            ]"
            :disabled="selectedAnswer !== null"
          >
            {{ op }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template> -->


<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import Spinner from "@/components/creator/Spinner.vue";
import { useQuestionsStore } from "@/stores/creator/questionsStore";
import { useGamesStore } from "@/stores/creator/gamesStore";

const route = useRoute();
const questionsStore = useQuestionsStore();
const gamesStore = useGamesStore();

const selectedAnswer = ref(null);
const socket = io(); 

const answerQuestion = (option, index) => {
  if (selectedAnswer.value === null) {
    selectedAnswer.value = index;
    gamesStore.answerQuestion(option, index);
    gamesStore.incrementAnsweredPlayers();
    
    // Emit the answer to the server
    socket.emit('player_answer', { option, index });
  }
};

// Watch for changes 
watch(() => questionsStore.currentQuestionIndex, () => {
  // Reset the selected answer when the question changes
  selectedAnswer.value = null;
});

onMounted(() => {
  // Listen for 'next_question' event from the server
  socket.on('next_question', () => {
    selectedAnswer.value = null;
  });
});

onUnmounted(() => {
  // Clean up Socket.IO listeners
  socket.off('next_question');
});
</script>

<template>
  <div class="min-h-screen bg-primary text-white p-6 flex flex-col justify-center items-center">
    <div class="w-full max-w-2xl bg-secondary rounded-lg shadow-lg p-8 transition-all duration-300">
      <h1 class="text-3xl font-bold mb-8 text-center text-white">
        {{ questionsStore.questions[questionsStore.currentQuestionIndex].text }}
      </h1>
      <div class="space-y-4">
        <button
          v-for="(op, index) in questionsStore.questions[questionsStore.currentQuestionIndex].option"
          :key="op"
          @click="answerQuestion(op, index)"
          :class="[
            'w-full px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-300',
            selectedAnswer === index
              ? 'bg-highlight text-primary'
              : 'bg-primary text-white hover:bg-accent'
          ]"
          :disabled="selectedAnswer !== null"
        >
          {{ op }}
        </button>
      </div>
    </div>
  </div>
</template> 