import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useGamesStore } from './gamesStore';
import { QUESTIONS_URL, GAMES_URL } from '@/Constant';

// const userToken =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMDY4NTBhOGE3YzQ5YmY1YzRhZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNjc1NDM0MiwiZXhwIjoxNzM4MDUwMzQyfQ.u8_tWA-KEgOdSIeWz5cavw-5F3VgXP0E992kRq8-bg8';

const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMTI5NTBhOGE3YzQ5YmY1YzRiNiIsInJvbGUiOiJjcmVhdG9yIiwiaWF0IjoxNzM2ODQ3MDE5LCJleHAiOjE3MzgxNDMwMTl9.l2-9-HikJM2oDYZiIKdDOdRYJgygsyY1-l03ET8Z2k4';

export const useQuestionsStore = defineStore('questions', () => {
  const gamesStore = useGamesStore();
  const questions = ref([]);
  const currentQuestionIndex = ref(0);
  const lastQuestion = ref(false);
  const loading = ref(false);
  const error = ref(null);

  function incrementQuestionIndex() {
    currentQuestionIndex.value++;
    if (currentQuestionIndex.value === questions.value.length - 2) {
      lastQuestion.value = true;
    }
  }

  function setQuestionIndex(index) {
    currentQuestionIndex.value = index;
    if (currentQuestionIndex.value === questions.value.length - 2) {
      lastQuestion.value = true;
    }
  }

  function isAnswerCorrect(index) {
    return questions.value[currentQuestionIndex.value].correctOptionId == index;
  }

  async function getQuestionsByGameId(gameId) {
    try {
      loading.value = true;
      const game = await gamesStore.getGameById(gameId);
      if (!game) {
        console.log('Game does not exist');
      }

      questions.value = [];
      const fetchedQuestions = await Promise.all(
        game.question_ids.map(async (id) => {
          const response = await fetch(`${QUESTIONS_URL}/${id}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          return response.json();
        })
      );
      questions.value = fetchedQuestions;
      console.log(questions.value);
      return questions.value;
    } catch (err) {
      error.value = err;
      console.log('Failed to Fetch questions by game!', err);
    } finally {
      loading.value = false;
    }
  }

  async function createQuestion(question) {
    try {
      loading.value = true;
      const response = await fetch(`${QUESTIONS_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          text: question.text,
          options: question.options,
          correctOptionId: question.correctOptionId,
          timeLimit: question.timeLimit,
        }),
      });

      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      error.value = err;
      console.log('Failed to Create a question', err);
    } finally {
      loading.value = false;
    }
  }

  return {
    questions,
    currentQuestionIndex,
    lastQuestion,
    loading,
    error,
    incrementQuestionIndex,
    setQuestionIndex,
    isAnswerCorrect,
    getQuestionsByGameId,
    createQuestion,
  };
});
