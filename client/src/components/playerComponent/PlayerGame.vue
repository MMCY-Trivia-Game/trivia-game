<template>
  <div class="min-h-screen bg-gradient-to-br from-[#2A004E] to-[#500073]/10">
    <!-- Join Game Form -->
    <div v-if="!gameState.isConnected" class="max-w-md mx-auto p-6">
      <GameEntryPopup 
        @join-game="handleJoinGame"
        @close="() => {}"
      />
    </div>

    <!-- Waiting Room -->
    <div v-else-if="!gameState.isActive" class="max-w-2xl mx-auto">
      <WaitingRoom 
        :gameId="gameState.gameId"
        :players="gameState.players"
        :isStarted="false" 
      />
    </div>

    <!-- Active Game -->
    <div v-else class="max-w-6xl mx-auto p-4">
      <PlayerProgress
        v-if="gameState.totalQuestions"
        :currentQuestion="gameState.currentQuestion + 1"
        :totalQuestions="gameState.totalQuestions"
        />

        <main class="space-y-8">
        <PlayerCard 
          v-if="currentQuestion && gameState.isActive"
          :question="currentQuestion.text"
          :options="currentQuestion.options"
          :timeLeft="timeLeft"
          :isConnected="gameState.isConnected"
          @submit-answer="handleAnswer"
        />
        </main>

      <!-- Debug Info -->
      <div v-if="isDevMode" class="fixed bottom-4 right-4 p-4 bg-white/10 rounded">
        <pre class="text-white text-xs">{{ JSON.stringify({
          isActive: gameState.isActive,
          currentQuestion: currentQuestion,
          questions: gameState.questions,
          gameStatus: gameState.gameStatus,
          timeLeft: timeLeft
        }, null, 2) }}</pre>
      </div>
    </div>

    <!-- Game Summary -->
    <GameSummary
      v-if="showSummary"
      :playerScore="playerScore"
      :leaderboard="gameState.players || []"
      @play-again="playAgain"
      @exit="leaveGame"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { usePlayerStore } from '@/stores/player/playerStore';
import { useRouter } from 'vue-router';
import PlayerProgress from './PlayerProgress.vue';
import playerHeader from './playerHeader.vue';
import PlayerCard from './PlayerCard.vue';
import playerTools from './playerTools.vue';
import Leaderboard from '../leaderboard/Leaderboard.vue';
import WaitingRoom from './WaitingRoom.vue';
import GameEntryPopup from './GameEntryPopup.vue';
import GameSummary from './GameSummary.vue';

const router = useRouter();
const playerStore = usePlayerStore();
const { gameState } = playerStore;

const isDark = ref(false);
const timeLeft = ref(30);
const showSummary = ref(false);
const playerScore = ref(0);
let timer = null;

const currentQuestion = computed(() => {
  if (!gameState.value.questions || !gameState.value.questions.length) {
    return null;
  }
  const question = gameState.value.questions[gameState.value.currentQuestion];
  console.log('Current question data:', {
    questionIndex: gameState.value.currentQuestion,
    question,
    allQuestions: gameState.value.questions
  });
  return question;
});

const isDevMode = computed(() => process.env.NODE_ENV === 'development');
const formattedGameState = computed(() => JSON.stringify(gameState, null, 2));

// Add watchers for debugging
// watch(() => gameState, (newState) => {
//   console.log('Game state changed:', newState);
// }, { deep: true });

// const handleJoinGame = async ({ gameId, playerName }) => {
//   console.log('Joining game:', gameId, playerName);
//   await playerStore.initSocket();
//   await playerStore.joinGame(gameId, playerName);
//   console.log('Game state after join:', gameState);
// };

// const handleAnswer = (answerId) => {
//   if (!gameState.value.isConnected) return;
  
//   console.log('Submitting answer:', {
//     gameId: gameState.value.gameId,
//     playerId: playerStore.socket.value.id,
//     answer: answerId,
//     questionId: gameState.value.currentQuestion,
//     timeSpent: 30 - timeLeft.value
//   });
  
//   playerStore.socket.value.emit('submitAnswer', {
//     gameId: gameState.value.gameId,
//     playerId: playerStore.socket.value.id,
//     answer: answerId,
//     questionId: gameState.value.currentQuestion,
//     timeSpent: 30 - timeLeft.value
//   });
// };

const startTimer = () => {
  clearInterval(timer);
  timeLeft.value = 30;
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark');
};

const leaveGame = () => {
  playerStore.leaveGame();
  router.push('/');
};

const playAgain = () => {
  showSummary.value = false;
  playerScore.value = 0;
  // Reset game state
};

const handleGameStarted = (data) => {
  console.log('Game started with data:', data);
  gameState.value = {
    ...gameState.value,
    isActive: true,
    currentQuestion: 0,
    questions: data.questions,
    totalQuestions: data.totalQuestions,
    gameStatus: 'active'
  };
  console.log('Game state after start:', gameState.value);
  startTimer();
};

const handleNextQuestion = (data) => {
  console.log('Next question received:', data);
  if (data.question) {
    const updatedQuestions = [...gameState.value.questions];
    updatedQuestions[data.questionNumber] = data.question;
    
    gameState.value = {
      ...gameState.value,
      currentQuestion: data.questionNumber,
      questions: updatedQuestions
    };
    console.log('Updated game state:', gameState.value);
    startTimer();
  }
};

// Socket event handlers
onMounted(() => {
  if (playerStore.socket) {
    playerStore.socket.on('gameStarted', handleGameStarted);
    playerStore.socket.on('nextQuestion', handleNextQuestion);
    playerStore.socket.on('gameEnded', () => {
      gameState.value.isActive = false;
      gameState.value.gameStatus = 'ended';
      showSummary.value = true;
    });
  }
});

onUnmounted(() => {
  clearInterval(timer);
  if (gameState.isConnected) {
    playerStore.leaveGame();
  }
  if (playerStore.socket) {
    playerStore.socket.off('gameStarted', handleGameStarted);
    playerStore.socket.off('nextQuestion', handleNextQuestion);
    playerStore.socket.off('gameEnded');
  }
});
</script>