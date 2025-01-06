<script setup>
import { CheckCircleIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  question: Object,
  num: Number,
});
</script>

<template>
  <div class="p-4 rounded-lg">
    <h2 class="mb-4 text-xl font-semibold text-white dark:text-white">
      {{ num }} ) {{ question.text }}
    </h2>
    <ul class="max-w-md space-y-4 text-white list-inside dark:text-gray-400">
      <li
        class="flex items-center space-x-2"
        v-for="(option, index) in question.option"
        :key="index"
      >
        <span v-if="index == question.correctOptionId">
          <CheckCircleIcon
            v-if="index == question.correctOptionId"
            class="w-4 h-4 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
          />
        </span>
        <span v-else class="w-6 h-4"></span>
        <span class="text-lg font-normal text-white">
          {{ String.fromCharCode(65 + index) }} ) {{ option }}
        </span>
      </li>
    </ul>
  </div>
</template>