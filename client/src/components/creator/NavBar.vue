<script setup>
import { ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { SearchIcon } from "@heroicons/vue/24/solid";

const profile = ref(false);

const toggleProfile = () => {
  profile.value = !profile.value;
};

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};
</script>

<template>
  <nav class="bg-secondary border-gray-200 dark:bg-gray-900">
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
    >
      <RouterLink
        to="/creator"
        class="flex items-center space-x-3 rtl:space-x-reverse"
      >
        <img src="@/assets/logo-highlight.png" class="h-8" alt="mtrivia Logo" />
      </RouterLink>
      <div class="flex items-center md:order-2 relative">
        <div
          v-if="isActiveLink('/creator')"
          class="relative md:block mr-4 w-full"
        >
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <SearchIcon class="w-4 h-4 text-gray-400 dark:text-gray-400" />
          </div>
          <input
            type="text"
            id="search-navbar"
            class="block w-full p-2 ps-10 text-sm text-white rounded-lg border border-gray-400 bg-secondary focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search..."
          />
        </div>
        <div class="relative">
          <button
            type="button"
            class="flex text-sm bg-gray-800 rounded-full md:me-0"
            id="user-menu-button"
            aria-expanded="false"
            @click="toggleProfile"
          >
            <span class="sr-only">Open user menu</span>
            <div
              class="size-8 rounded-full bg-primary text-white flex justify-center items-center"
            >
              C
            </div>
          </button>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              :class="[
                profile ? '' : 'hidden',
                'absolute right-0 top-5 z-50 my-4 origin-top-right text-base list-none bg-secondary divide-y divide-gray-500 rounded-lg dark:bg-gray-700 shadow-2xl dark:divide-gray-600 border border-gray-500',
              ]"
              id="user-dropdown"
            >
              <div class="px-4 py-3">
                <span class="block text-sm text-white dark:text-white"
                  >Bonnie Green</span
                >
                <span
                  class="block text-sm text-gray-500 truncate dark:text-gray-400"
                  >name@flowbite.com</span
                >
              </div>
              <ul class="py-2" aria-labelledby="user-menu-button">
                <li>
                  <RouterLink
                    to="/creator/profile"
                    class="block px-4 py-2 text-sm text-white hover:bg-primary dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >Profile</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="/creator/games/my"
                    class="block px-4 py-2 text-sm text-white hover:bg-primary dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >My Games</RouterLink
                  >
                </li>
                <li>
                  <RouterLink
                    to="#"
                    class="block px-4 py-2 text-sm text-white hover:bg-primary dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >Sign out</RouterLink
                  >
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </nav>
</template>