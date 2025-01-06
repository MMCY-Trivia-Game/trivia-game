<script setup>
const props = defineProps({
  question: Object,
});
</script>

<template>
  <div class="mb-8 bg-secondary p-6 rounded-lg">
    <p class="text-2xl font-semibold">{{ question.text }}</p>
    <ul class="mt-4 pl-4">
      <li
        v-for="(option, index) in question.options"
        :key="index"
        class="px-4 py-2 rounded-lg text-lg font-medium"
      >
        {{ String.fromCharCode(65 + index) }}) {{ option }}
      </li>
    </ul>
  </div>
</template>