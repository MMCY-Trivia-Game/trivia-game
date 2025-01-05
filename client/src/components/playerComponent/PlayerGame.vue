<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300',
      isDark
        ? 'dark bg-gradient-to-br from-[#2A004E]/80 to-[#500073]/80'
        : 'bg-gradient-to-br from-[#2A004E] to-[#500073]/10',
    ]"
  >
    <div class="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      <!-- <PlayerProgress
        :currentQuestion="currentQuestion"
        :totalQuestions="totalQuestions"
        class="hidden md:flex"
      /> -->

      <div class="flex-1">
        <playerHeader
          :currentQuestion="currentQuestion"
          :totalQuestions="totalQuestions"
          :isDark="isDark"
          @toggle-dark="toggleDarkMode"
        />

        <main class="space-y-8">
          <PlayerCard :timeLeft="timeLeft" :question="currentQuestion" />
          <playerTools />
        </main>
      </div>

      <Leaderboard class="hidden md:block md:w-1/4 md:order-last mt-16" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PlayerProgress from "./PlayerProgress.vue";
import playerHeader from "./playerHeader.vue";
import PlayerCard from "./PlayerCard.vue";
import playerTools from "./playerTools.vue";
import Leaderboard from "./../leaderboard/Leaderboard.vue";

const currentQuestion = ref(3);
const timeLeft = ref(10);
const isDark = ref(false);
const totalQuestions = 6;

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark");
};
</script>
