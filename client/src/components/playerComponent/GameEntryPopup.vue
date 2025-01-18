<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
        <h2 class="text-2xl font-semibold mb-4 text-secondary dark:text-white">
          Join Game
        </h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-secondary dark:text-white mb-1">
              Game ID
            </label>
            <input 
              v-model="gameId"
              type="text"
              class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter game ID"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-secondary dark:text-white mb-1">
              Your Name
            </label>
            <input 
              v-model="playerName"
              type="text"
              class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Enter your name"
              required
            />
          </div>
  
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[#F14A00] text-white rounded-lg hover:bg-[#F14A00]/90"
            >
              Join Game
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const gameId = ref('');
  const playerName = ref('');
  
  const emit = defineEmits(['close', 'join-game']);
  
  const handleSubmit = () => {
    emit('join-game', {
      gameId: gameId.value,
      playerName: playerName.value
    });
  };
  </script>