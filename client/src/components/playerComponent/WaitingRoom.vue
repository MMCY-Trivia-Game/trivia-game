<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
    <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-2xl">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">Waiting Room</h2>
        <p class="text-white/80">Game Code: <span class="font-mono font-bold">{{ gameId }}</span></p>
      </div>

      <!-- Players List with Animation -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <TransitionGroup name="player-list">
          <div
            v-for="player in players"
            :key="player.id"
            class="bg-white/20 rounded-lg p-4 text-white flex items-center space-x-3"
          >
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{{ player.name }}</span>
          </div>
        </TransitionGroup>
      </div>

      <!-- Status Message -->
      <div class="text-center text-white/80">
        <p v-if="!isStarted">Waiting for host to start the game...</p>
        <p v-else class="animate-pulse">Game is starting...</p>
      </div>

      <!-- Debug Info -->
      <div v-if="isDevMode" class="mt-4 p-4 bg-white/10 rounded">
        <p class="text-white text-sm mb-2">Debug Info:</p>
        <pre class="text-white/80 text-xs overflow-auto">
          Players: {{ formattedPlayers }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  gameId: {
    type: String,
    required: true
  },
  players: {
    type: Array,
    default: () => []
  },
  isStarted: {
    type: Boolean,
    default: false
  }
});

const isDevMode = computed(() => process.env.NODE_ENV === 'development');
const formattedPlayers = computed(() => JSON.stringify(props.players, null, 2));
</script>

<style scoped>
.player-list-enter-active,
.player-list-leave-active {
  transition: all 0.5s ease;
}

.player-list-enter-from,
.player-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.player-list-move {
  transition: transform 0.5s ease;
}
</style> 