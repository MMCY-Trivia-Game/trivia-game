<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit"]);

const props = defineProps({
  questionNumber: Number,
});

const newQuestion = ref({
  text: "",
  options: ["", ""],
  correctOptionId: null,
  timeLimit: 15,
});

const errors = ref({
  questionText: false,
  correctOption: false,
  options: false,
});

const addQuestion = () => {
  errors.value.questionText = !newQuestion.value.text;
  errors.value.correctOption = newQuestion.value.correctOptionId === null;
  errors.value.options = newQuestion.value.options.some((opt) => !opt);

  if (
    errors.value.questionText ||
    errors.value.correctOption ||
    errors.value.options
  ) {
    return;
  }

  emit("add-question", { ...newQuestion.value });
  console.log(newQuestion.value);

  newQuestion.value.text = "";
  newQuestion.value.options = ["", ""];
  newQuestion.value.correctOptionId = null;
  newQuestion.value.timeLimit = 30;
};
</script>

<template>
  <div class="mb-8 p-6 bg-secondary rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Question {{ questionNumber }}</h2>

    <div>
      <label for="questionText" class="block text-lg font-medium mb-3"
        >Question</label
      >
      <input
        id="questionText"
        v-model="newQuestion.text"
        type="text"
        placeholder="Enter question text"
        class="w-full px-4 py-2 mt-1 bg-primary text-white rounded-lg focus:ring-2 focus:ring-accent"
      />
      <p v-if="errors.questionText" class="text-red-500 mt-1">
        Question text is required
      </p>
    </div>

    <div class="mt-4 space-y-3">
      <h1 class="block text-lg font-medium">Options</h1>
      <div
        v-for="(option, index) in newQuestion.options"
        :key="index"
        class="flex items-center"
      >
        <input
          v-model="newQuestion.options[index]"
          type="text"
          placeholder="Enter option"
          class="w-full px-4 py-2 bg-primary text-white rounded-lg focus:ring-2 focus:ring-accent"
        />
        <input
          type="radio"
          :value="index"
          v-model="newQuestion.correctOptionId"
          class="ml-4 bg-primary w-4 h-4 text-accent border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
      <p v-if="errors.options" class="text-red-500 mt-1">
        All options are required
      </p>
      <p v-if="errors.correctOption" class="text-red-500 mt-1">
        Please select the correct option
      </p>
    </div>

    <div class="mt-4">
      <button
        v-if="newQuestion.options.length < 4"
        @click="newQuestion.options.push('')"
        class="px-2 py-2 text-sm font-medium bg-none text-white rounded-lg hover:text-green-600"
      >
        + Add Option
      </button>
      <button
        v-if="newQuestion.options.length > 2"
        @click="newQuestion.options.pop()"
        class="px-2 py-2 text-sm font-medium bg-none text-white rounded-lg hover:text-red-600"
      >
        - Remove Option
      </button>
    </div>

    <div class="mt-4">
      <label for="timeLimit" class="block text-lg font-medium"
        >Time Limit (seconds)</label
      >
      <input
        id="timeLimit"
        v-model="newQuestion.timeLimit"
        type="number"
        min="10"
        max="120"
        placeholder="Time to answer"
        class="w-full px-4 py-2 mt-1 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-accent"
      />
    </div>

    <div class="text-center mt-10">
      <button
        @click="addQuestion"
        class="px-6 py-3 bg-accent text-white rounded-lg shadow-lg hover:bg-tertiary"
      >
        Add Question
      </button>
    </div>
  </div>
</template>
