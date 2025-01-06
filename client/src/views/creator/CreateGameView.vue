<script setup>
import { ref } from "vue";
import GameDetailsForm from "@/components/creator/GameDetailsForm.vue";
import QuestionForm from "@/components/creator/QuestionForm.vue";
import router from "@/router/route";

const game = ref({
  title: "",
  maxPlayers: "",
  category: "",
  questions: [],
});

const questions = ref([]);

const addingQuestion = ref(false);

const handleGameDetailsSubmit = (details) => {
  game.value = { ...game.value, ...details };
  addingQuestion.value = !addingQuestion.value;
  console.log(details);
};

const handleAddQuestion = (question) => {
  game.value.questions.push(question);
  questions.value.push(question);
};

const createGame = () => {
  if (
    !game.value.title ||
    !game.value.maxPlayers ||
    !game.value.category ||
    !game.value.questions.length
  ) {
    alert("Please complete all fields and add at least one question!");
    return;
  }
  console.log("Game created:", game.value);
  // TODO: This is supposed to go on the singleGameView
  router.push("/creator/");
};
</script>

<template>
  <div>
    <div class="bg-primary min-h-screen text-white">
      <div class="max-w-screen-md mx-auto p-6">
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-white">
            {{ game.title || "Create a New Game" }}
          </h1>
        </header>

        <GameDetailsForm
          v-if="!addingQuestion"
          @submit="handleGameDetailsSubmit"
        />

        <QuestionForm
          v-else
          @add-question="handleAddQuestion"
          :questionNumber="questions.length + 1"
        />

        <div class="text-center mt-8">
          <button
            v-if="addingQuestion"
            @click="createGame"
            class="px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600"
          >
            Create Game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
