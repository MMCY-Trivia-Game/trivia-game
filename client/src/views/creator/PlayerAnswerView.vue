<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import Spinner from "@/components/creator/Spinner.vue";

const route = useRoute();
const socket = io("http://localhost:5000");

const question = ref({
  text: "Sample Question",
  options: ["Option A", "Option B", "Option C", "Option D"],
});

const answerQuestion = (option) => {
  socket.emit("answerQuestion", {
    gameCode: route.params.id,
    playerId: socket.id,
    answer: option,
  });
};
</script>

<template>
  <div
    class="min-h-screen bg-primary text-white p-6 flex flex-col justify-center items-center"
  >
    <h1 class="text-3xl font-bold mb-6">{{ question.text }}</h1>
    <div class="space-y-4">
      <button
        v-for="option in question.options"
        :key="option"
        @click="answerQuestion(option)"
        class="w-full px-4 py-2 bg-secondary rounded-lg"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>
