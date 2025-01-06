<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="bg-secondary dark:bg-gray-900 rounded-lg">
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 mb-4">
      <h1
        class="mb-8 text-4xl font-extrabold tracking-tight leading-none text-white md:text-5xl lg:text-6xl dark:text-white"
      >
        Want to Create Your Own Trivia?
      </h1>

      <div
        class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0"
      >
        <RouterLink
          to="/creator/game/create"
          class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-purple-950 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        >
          Create Trivia
        </RouterLink>
      </div>
    </div>
  </section>
</template>