import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { io } from 'socket.io-client';
import { GAMES_URL } from '@/Constant';
import router from '@/router/route';
import { useQuestionsStore } from './questionsStore';
import { useLeaderboardStore } from './leaderboardStore';

// const localStorage.getItem('accessToken') =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMDY4NTBhOGE3YzQ5YmY1YzRhZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNjc1NDM0MiwiZXhwIjoxNzM4MDUwMzQyfQ.u8_tWA-KEgOdSIeWz5cavw-5F3VgXP0E992kRq8-bg8';
const userToken = localStorage.getItem('accessToken')
  ? localStorage.getItem('accessToken')
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMTVhNTBhOGE3YzQ5YmY1YzRiYyIsInJvbGUiOiJjcmVhdG9yIiwiZmlyc3RfbmFtZSI6IkZyYW5rIiwibGFzdF9uYW1lIjoiVGF5bG9yIiwiZW1haWwiOiJmcmFuay50YXlsb3JAY3JlYXRvci5jb20iLCJpc19hY3RpdmUiOmZhbHNlLCJpYXQiOjE3MzgwNjYzNjYsImV4cCI6MTczOTM2MjM2Nn0.T8lx4npo6-1NKSB7sKJEO662B66cHBA7GEpBdux_56E';

const socket = io('http://192.168.8.210:5000');

export const useGamesStore = defineStore('games', () => {
  const questionsStore = useQuestionsStore();
  const leaderboardStore = useLeaderboardStore();
  const games = ref([]);
  const gamesByCategory = ref([]);
  const selectedGame = ref({});
  const ansCounts = ref({});
  const notAnsCounts = ref(0);
  const answeredPlayers = ref(0);
  const questionAnalysis = ref({});
  const categories = ref([
    'General Knowledge',
    'Technology',
    'History',
    'Geography',
    'Entertainment',
    'Sports',
    'Culture',
    'Food and Drink',
    'Mythology',
    'Fun',
    'Others',
  ]);
  const loading = ref(false);
  const error = ref(null);
  const players = ref([]);
  const gameCode = ref(null);
  const gameStarted = ref(false);
  const gameEnded = ref(true);

  const playerLength = computed(() => players.value.length);

  function toggleGameEnded() {
    gameEnded.value = !gameEnded.value;
  }

  function resetAnsweredPlayers() {
    answeredPlayers.value = 0;
  }

  function incrementAnsweredPlayers() {
    answeredPlayers.value += 1;
  }

  async function getGames() {
    try {
      loading.value = true;
      const response = await fetch(`${GAMES_URL}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('accessToken')
              ? localStorage.getItem('accessToken')
              : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMTVhNTBhOGE3YzQ5YmY1YzRiYyIsInJvbGUiOiJjcmVhdG9yIiwiZmlyc3RfbmFtZSI6IkZyYW5rIiwibGFzdF9uYW1lIjoiVGF5bG9yIiwiZW1haWwiOiJmcmFuay50YXlsb3JAY3JlYXRvci5jb20iLCJpc19hY3RpdmUiOmZhbHNlLCJpYXQiOjE3MzgwNjYzNjYsImV4cCI6MTczOTM2MjM2Nn0.T8lx4npo6-1NKSB7sKJEO662B66cHBA7GEpBdux_56E'
          }`,
        },
      });
      const data = await response.json();
      games.value = data;
    } catch (err) {
      error.value = 'Failed To fetch Games!';
      console.log('Failed To fetch Games!');
    } finally {
      loading.value = false;
    }
  }

  async function getGameById(gameId) {
    try {
      loading.value = true;
      const response = await fetch(`${GAMES_URL}/${gameId}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('accessToken')
              ? localStorage.getItem('accessToken')
              : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMTVhNTBhOGE3YzQ5YmY1YzRiYyIsInJvbGUiOiJjcmVhdG9yIiwiZmlyc3RfbmFtZSI6IkZyYW5rIiwibGFzdF9uYW1lIjoiVGF5bG9yIiwiZW1haWwiOiJmcmFuay50YXlsb3JAY3JlYXRvci5jb20iLCJpc19hY3RpdmUiOmZhbHNlLCJpYXQiOjE3MzgwNjYzNjYsImV4cCI6MTczOTM2MjM2Nn0.T8lx4npo6-1NKSB7sKJEO662B66cHBA7GEpBdux_56E'
          }`,
        },
      });
      const data = await response.json();
      // console.log(data.game);
      selectedGame.value = data.game;
      console.log(selectedGame.value);
      return data.game;
    } catch (err) {
      error.value = 'Failed To fetch Game By ID!';
      console.log(err);
    } finally {
      loading.value = false;
    }
  }

  async function getMyGames() {
    try {
      loading.value = true;
      const response = await fetch(`${GAMES_URL}/my`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('accessToken')
              ? localStorage.getItem('accessToken')
              : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMTVhNTBhOGE3YzQ5YmY1YzRiYyIsInJvbGUiOiJjcmVhdG9yIiwiZmlyc3RfbmFtZSI6IkZyYW5rIiwibGFzdF9uYW1lIjoiVGF5bG9yIiwiZW1haWwiOiJmcmFuay50YXlsb3JAY3JlYXRvci5jb20iLCJpc19hY3RpdmUiOmZhbHNlLCJpYXQiOjE3MzgwNjYzNjYsImV4cCI6MTczOTM2MjM2Nn0.T8lx4npo6-1NKSB7sKJEO662B66cHBA7GEpBdux_56E'
          }`,
        },
      });

      const data = await response.json();
      games.value = data;
    } catch (err) {
      error.value = 'Failed to Fetch my games';
    } finally {
      loading.value = false;
    }
  }

  async function getGamesByCategory(category) {
    try {
      loading.value = true;
      const response = await fetch(`${GAMES_URL}/category/${category}`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem('accessToken')
              ? localStorage.getItem('accessToken')
              : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMTVhNTBhOGE3YzQ5YmY1YzRiYyIsInJvbGUiOiJjcmVhdG9yIiwiZmlyc3RfbmFtZSI6IkZyYW5rIiwibGFzdF9uYW1lIjoiVGF5bG9yIiwiZW1haWwiOiJmcmFuay50YXlsb3JAY3JlYXRvci5jb20iLCJpc19hY3RpdmUiOmZhbHNlLCJpYXQiOjE3MzgwNjYzNjYsImV4cCI6MTczOTM2MjM2Nn0.T8lx4npo6-1NKSB7sKJEO662B66cHBA7GEpBdux_56E'
          }`,
        },
      });
      const data = await response.json();
      return data;
    } catch (err) {
      error.value = 'Failed to Fetch Games By Category!';
      console.log('Failed to Fetch Games By Category!', err);
    } finally {
      loading.value = false;
    }
  }

  async function createGame(game) {
    try {
      loading.value = true;
      const response = await fetch(`${GAMES_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            localStorage.getItem('accessToken')
              ? localStorage.getItem('accessToken')
              : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMTVhNTBhOGE3YzQ5YmY1YzRiYyIsInJvbGUiOiJjcmVhdG9yIiwiZmlyc3RfbmFtZSI6IkZyYW5rIiwibGFzdF9uYW1lIjoiVGF5bG9yIiwiZW1haWwiOiJmcmFuay50YXlsb3JAY3JlYXRvci5jb20iLCJpc19hY3RpdmUiOmZhbHNlLCJpYXQiOjE3MzgwNjYzNjYsImV4cCI6MTczOTM2MjM2Nn0.T8lx4npo6-1NKSB7sKJEO662B66cHBA7GEpBdux_56E'
          }`,
        },
        body: JSON.stringify({
          title: game.title,
          maxUsers: game.maxPlayers,
          category: game.category,
        }),
      });

      const data = await response.json();
      const newGame = data.game;

      // console.log(selectedGame.value);
      // console.log(data);

      const questions = await Promise.all(
        game.questions.map(async (question) => {
          const q = await questionsStore.createQuestion(question);
          await addQuestion(newGame._id, q._id);
          console.log(q);
        })
      );

      router.push(`/creator/game/${newGame._id}`);

      // console.log(data.game);
    } catch (err) {
      error.value = 'Failed to create a game';
      console.log('Failed To Create the game', err);
    } finally {
      loading.value = false;
    }
  }

  async function addQuestion(gameId, questionId) {
    try {
      const response = await fetch(`${GAMES_URL}/questions/add/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${
            localStorage.getItem('accessToken')
              ? localStorage.getItem('accessToken')
              : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMTVhNTBhOGE3YzQ5YmY1YzRiYyIsInJvbGUiOiJjcmVhdG9yIiwiZmlyc3RfbmFtZSI6IkZyYW5rIiwibGFzdF9uYW1lIjoiVGF5bG9yIiwiZW1haWwiOiJmcmFuay50YXlsb3JAY3JlYXRvci5jb20iLCJpc19hY3RpdmUiOmZhbHNlLCJpYXQiOjE3MzgwNjYzNjYsImV4cCI6MTczOTM2MjM2Nn0.T8lx4npo6-1NKSB7sKJEO662B66cHBA7GEpBdux_56E'
          }`,
        },
        body: JSON.stringify({
          question_id: questionId,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  function joinGame(gameCode, playerName) {
    socket.emit('joinGame', gameCode, playerName);
  }

  function startGame() {
    if (!gameCode.value) {
      socket.emit(
        'startGame',
        selectedGame.value.game_code,
        selectedGame.value._id
      );
    }
  }

  function endGame() {
    leaderboardStore.formatAndRankPlayers(players.value);
    leaderboardStore.createLeaderboard();
    router.push(`/creator/game/${selectedGame.value._id}/report/final`);
    socket.emit('endGame', selectedGame.value.game_code);
  }

  function getQuestionAnalysis() {
    const question =
      questionsStore.questions[questionsStore.currentQuestionIndex];
    const answers = new Array(question.option.length).fill(0);
    Object.keys(ansCounts.value).forEach((key) => {
      answers[key] = ansCounts.value[key];
    });

    questionAnalysis.value = {
      text: question.text,
      options: question.option,
      correctOption: question.correctOptionId,
      answers: answers,
      noAnswer: notAnsCounts,
    };
    console.log(questionAnalysis.value);
  }

  function creatorJoin() {
    socket.emit('creatorJoin', selectedGame.value.game_code);
    console.log('test creator joined');
  }

  function nextQuestion() {
    socket.emit(
      'nextQuestion',
      selectedGame.value.game_code,
      questionsStore.questions[questionsStore.currentQuestionIndex + 1].option
        .length
    );
    resetAnsweredPlayers();
  }

  function answerQuestion(answer, index) {
    socket.emit('answerQuestion', {
      gameCode: selectedGame.value.game_code,
      playerId: socket.id,
      answer,
      answeredCorrectly: questionsStore.isAnswerCorrect(index),
      index,
    });

    // incrementAnsweredPlayers();
  }

  // function answerCountInitialization() {
  //   socket.emit(
  //     'answerCountInitialization',
  //     selectedGame.value.game_code,
  //     questionsStore.questions[questionsStore.currentQuestionIndex + 1].option
  //       .length
  //   );
  // }

  function listenForPlayersUpdates() {
    socket.on('playerJoined', (data) => {
      console.log('Testing Player Joined');
      players.value = data.players;
      gameCode.value = data.gameCode;
      console.log(players.value.map((p) => p));
      console.log('Player Joined');
    });

    socket.on('playerLeft', (data) => {
      players.value = data.players;
      console.log(`Player left: ${data.player.name}`);
    });

    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
    });

    socket.on(
      'updateScores',
      (updatedPlayers, answersCount, playersWhoDidNotAnswer) => {
        players.value = updatedPlayers;
        ansCounts.value = answersCount;
        notAnsCounts.value = playersWhoDidNotAnswer;
        incrementAnsweredPlayers();
        console.log('testing update scores');
        console.log(players.value);
      }
    );

    socket.on('gameEnded', () => {
      players.value = [];
      ansCounts.value = {};
      notAnsCounts.value = 0;
      answeredPlayers.value = 0;
    });
  }

  function listenForUpdateCreatorSide() {
    socket.on('gameStarted', (id) => {
      gameStarted.value = true;
      gameEnded.value = false;
      router.push(`/creator/game/${selectedGame.value._id}/start`);
    });

    socket.on('nextQuestion', (index) => {
      questionsStore.incrementQuestionIndex();
      router.push(`/creator/game/${selectedGame.value._id}/start`);
    });
  }

  function listenForUpdatePlayerSide() {
    socket.on('gameStarted', (id) => {
      gameStarted.value = true;
      gameEnded.value = false;
      getGameById(id).then(() => {
        questionsStore.getQuestionsByGameId(id);
        router.push(`/game/${selectedGame.value._id}/play`);
      });
    });

    socket.on('nextQuestion', (index) => {
      questionsStore.incrementQuestionIndex();
      router.push(`/game/${selectedGame.value._id}/play`);
    });
  }

  return {
    games,
    gamesByCategory,
    selectedGame,
    ansCounts,
    notAnsCounts,
    answeredPlayers,
    questionAnalysis,
    categories,
    loading,
    error,
    players,
    gameCode,
    gameStarted,
    gameEnded,
    playerLength,
    toggleGameEnded,
    resetAnsweredPlayers,
    incrementAnsweredPlayers,
    getGames,
    getGameById,
    getMyGames,
    getGamesByCategory,
    getQuestionAnalysis,
    createGame,
    joinGame,
    startGame,
    endGame,
    creatorJoin,
    nextQuestion,
    answerQuestion,
    listenForPlayersUpdates,
    listenForUpdateCreatorSide,
    listenForUpdatePlayerSide,
  };
});
