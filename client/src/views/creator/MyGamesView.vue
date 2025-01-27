<script setup>
import NavBar from "@/components/creator/NavBar.vue";
import MyGamesList from "@/components/creator/MyGamesList.vue";
</script>

<template>
  <div>
    <div class="bg-primary min-h-screen">
      <NavBar />
      <div class="max-w-screen-xl mx-auto p-6">
        <h4 class="text-2xl font-semibold text-white mb-4 dark:text-white">
          My Games
        </h4>
        <MyGamesList />
      </div>
    </div>
  </div>
</template>