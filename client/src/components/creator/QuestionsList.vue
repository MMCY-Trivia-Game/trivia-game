<script setup>
import QuestionCard from "./QuestionCard.vue";

const props = defineProps({
  questions: Array,
});
</script>

<template>
  <div>
    <QuestionCard
      v-for="(question, index) in questions"
      :key="question._id"
      :question="question"
      :num="index + 1"
    />
  </div>
</template>