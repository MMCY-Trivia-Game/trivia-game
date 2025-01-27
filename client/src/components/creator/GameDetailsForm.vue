<script setup>
import { ref } from "vue";
import { useGamesStore } from "@/stores/creator/gamesStore";

const emit = defineEmits(["submit"]);
const gamesStore = useGamesStore();

const gameDetails = ref({
  title: "",
  maxPlayers: "",
  category: "",
});

const categories = gamesStore.categories;
const errors = ref({
  title: false,
  maxPlayers: false,
  category: false,
});

const submitDetails = () => {
  errors.value.title = !gameDetails.value.title;
  errors.value.maxPlayers =
    !gameDetails.value.maxPlayers ||
    isNaN(gameDetails.value.maxPlayers) ||
    gameDetails.value.maxPlayers < 2;
  errors.value.category = !gameDetails.value.category;

  if (errors.value.title || errors.value.maxPlayers || errors.value.category) {
    return;
  }

  emit("submit", gameDetails.value);
};
</script>

<template>
  <div class="mb-8 space-y-4 p-6 bg-secondary rounded-lg">
    <div>
      <label for="title" class="block text-lg font-medium">Game Title</label>
      <input
        id="title"
        v-model="gameDetails.title"
        type="text"
        placeholder="Enter game title"
        class="w-full px-4 py-2 mt-1 bg-primary text-white rounded-lg focus:ring-2 focus:ring-accent"
      />
      <p v-if="errors.title" class="text-red-500 mt-1">
        Game title is required
      </p>
    </div>

    <div>
      <label for="maxPlayers" class="block text-lg font-medium"
        >Max Players</label
      >
      <input
        id="maxPlayers"
        v-model="gameDetails.maxPlayers"
        type="number"
        placeholder="Enter max players"
        class="w-full px-4 py-2 mt-1 bg-primary text-white rounded-lg focus:ring-2 focus:ring-accent"
      />
      <p v-if="errors.maxPlayers" class="text-red-500 mt-1">
        Valid number of players is required (at least 2 players)
      </p>
    </div>

    <div>
      <label for="category" class="block text-lg font-medium">Category</label>
      <select
        id="category"
        v-model="gameDetails.category"
        class="w-full px-4 py-2 mt-1 bg-primary text-white rounded-lg focus:ring-2 focus:ring-accent"
      >
        <option value="" disabled>Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <p v-if="errors.category" class="text-red-500 mt-1">
        Category is required
      </p>
    </div>

    <div class="text-center mt-6">
      <button
        @click="submitDetails"
        class="px-6 py-3 bg-accent hover:bg-red-800 text-white rounded-lg shadow-lg hover:bg-tertiary"
      >
        Next
      </button>
    </div>
  </div>
</template>
