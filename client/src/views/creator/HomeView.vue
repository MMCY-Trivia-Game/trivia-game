<script setup>
import CategoryList from "@/components/creator/CategoryList.vue";
import NavBar from "@/components/creator/NavBar.vue";
import HomeJumbotron from "@/components/creator/HomeJumbotron.vue";
import Spinner from "@/components/creator/Spinner.vue";
import { useGamesStore } from "@/stores/creator/gamesStore";

const gamesStore = useGamesStore();
</script>
<template>
  <div>
    <div class="bg-primary min-h-screen">
      <NavBar />
      <div class="max-w-screen-xl mx-auto p-6">
        <HomeJumbotron />
        <Spinner v-if="gamesStore.loading" />
        <CategoryList />
      </div>
    </div>
  </div>
</template>