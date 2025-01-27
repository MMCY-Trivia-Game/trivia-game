<template>
    <aside id="logo-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-primary border-r-2 border-dashed border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar">
        <div class="h-full px-3 pb-4 overflow-y-auto bg-primary dark:bg-gray-800">
            <ul class="space-y-2 font-medium">
                <li>
                    <router-link :to="{ name: 'dashboard' }"
                        class="hover:text-secondary flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <ChartPieIcon class="w-5 h-5 " />
                        <span class="ms-3">Dashboard</span>
                    </router-link>

                    <router-link :to="{ name: 'users' }"
                        class="hover:text-secondary flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <UserGroupIcon class="w-5 h-5 " />
                        <span class="ms-3">Users</span>
                    </router-link>

                    <router-link :to="{ name: 'games' }"
                        class="hover:text-secondary flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <PuzzlePieceIcon class="w-5 h-5 " />
                        <span class="ms-3">Games</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup>
import { ChartPieIcon, UserGroupIcon, PuzzlePieceIcon } from '@heroicons/vue/24/solid'
</script>
