<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Trivia Game
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Create or join a game to get started!
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Create Game Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Create a Game
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Host your own trivia game and invite players
          </p>
          <router-link
            to="/creator/test"
            class="inline-block px-6 py-3 bg-highlight text-white rounded-lg hover:bg-highlight/90"
          >
            Create Game
          </router-link>
        </div>

        <!-- Join Game Card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Join a Game
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Enter a game code to join an existing game
          </p>
          <router-link
            to="/games"
            class="inline-block px-6 py-3 bg-highlight text-white rounded-lg hover:bg-highlight/90"
          >
            Join Game
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic here
</script> 