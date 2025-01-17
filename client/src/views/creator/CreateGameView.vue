<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Game</h1>
        
        <!-- Game Details Form -->
        <form @submit.prevent="createGame" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Game Title
            </label>
            <input
              v-model="gameData.title"
              type="text"
              class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <!-- Questions Section -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Questions</h2>
            <div
              v-for="(question, index) in gameData.questions"
              :key="index"
              class="p-4 border rounded-lg dark:border-gray-700"
            >
              <div class="flex justify-between mb-2">
                <h3 class="font-medium">Question {{ index + 1 }}</h3>
                <button
                  @click="removeQuestion(index)"
                  class="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              
              <div class="space-y-3">
                <input
                  v-model="question.text"
                  type="text"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Question text"
                />
                
                <div v-for="(option, optIndex) in question.options" :key="optIndex">
                  <div class="flex gap-2 items-center">
                    <input
                      v-model="option.text"
                      type="text"
                      class="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      :placeholder="`Option ${optIndex + 1}`"
                    />
                    <input
                      type="radio"
                      :name="`correct-${index}`"
                      :value="option.id"
                      v-model="question.correctOptionId"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              @click="addQuestion"
              class="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              Add Question
            </button>
          </div>

          <div class="flex justify-end gap-4">
            <router-link
              to="/creator/games/my"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              class="px-4 py-2 bg-highlight text-white rounded-lg hover:bg-highlight/90"
              :disabled="isSubmitting"
            >
              Create Game
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';

const router = useRouter();
const isSubmitting = ref(false);

const gameData = ref({
  title: '',
  questions: []
});

const addQuestion = () => {
  gameData.value.questions.push({
    text: '',
    options: [
      { id: 1, text: '' },
      { id: 2, text: '' },
      { id: 3, text: '' },
      { id: 4, text: '' }
    ],
    correctOptionId: null
  });
};

const removeQuestion = (index) => {
  gameData.value.questions.splice(index, 1);
};

const createGame = async () => {
  try {
    isSubmitting.value = true;
    const response = await api.post('/api/games/create', gameData.value);
    router.push('/creator/games/my');
  } catch (error) {
    console.error('Error creating game:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
