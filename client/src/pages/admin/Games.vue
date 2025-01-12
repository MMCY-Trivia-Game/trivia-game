<template>
    <h3 class="text-primary  font-bold text-2xl">Users</h3>
    <!--Search game-->
    <section class="w-full md:w-1/3">
        <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <MagnifyingGlassIcon class="text-primary h-4 w-4" />
            </div>
            <input type="search" id="search"
                class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                placeholder="Search" required />
            <div class="absolute end-2.5 bottom-2.5">
                <Button type="button" title="Search"></Button>
            </div>

        </div>
    </section>

    <!--categories-->
    <section class="flex flex-row pt-3 ps-2 pe-2 pb-3 gap-4 mt-5 justify-between overflow-x-auto scrollbar-hide">
        <FwbButton class="w-30 h-8 sm:w-30 sm:h-8" size="sm" v-for="category in categories"
            :color="`${selectedCategory == category ? 'purple' : 'alternative'}`"
            @click="handleOnCategorySelected(category)">
            {{ category }}
        </FwbButton>
    </section>

    <!--Game List-->
    <section class=" mt-5 grid grid-cols-3 gap-4 mb-4 md:grid-cols-4 lg:grid-cols-8">
        <GameListCard v-if="!gameStore.isLoading && gameStore.games.length > 0" v-for="game in gameStore.games"
            @click="toggleModal" :title="game.title" :active="game.is_active"
            :image="gameImages[Math.floor(Math.random() * gameImages.length)]" />
    </section>

    <!-- No game found message -->
    <div v-if="!gameStore.isLoading && gameStore.games.length === 0" class="flex justify-center items-center text-center">
        <p class="text-highlight">No game found</p>
    </div>

    <!--show loading-->
    <div class="flex justify-center items-center text-center">
        <fwb-spinner v-if="gameStore.isLoading" size="10" color="purple" />
    </div>


    <!--Modal Game detail-->
    <GameDetailModal @close="toggleModal" :isShowModal="isShowModal" />
</template>

<script setup>
import { ref } from 'vue';

import GameListCard from '@/components/admin-component/ui/GameListCard.vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import Button from '@/components/admin-component/ui/PrimaryButton.vue'
import { FwbButton, FwbSpinner } from 'flowbite-vue'
import GameDetailModal from '@/components/admin-component/modal/GameDetailModal.vue'
import { useGameStore } from '@/stores/admin/gameStore';

//images
import arcadeImage from '@/assets/gameIcons/arcade.png'
import controllerImage from '@/assets/gameIcons/controller.png'
import gameConsoleImage from '@/assets/gameIcons/game-console.png'
import gamerImage from '@/assets/gameIcons/gamer.png'
import ghostImage from '@/assets/gameIcons/ghost.png'
import joystickImage from '@/assets/gameIcons/joystick.png'
import mushroomImage from '@/assets/gameIcons/mushroom.png'
import pikachuImage from '@/assets/gameIcons/pikachu.png'
import { onMounted } from 'vue';


const gameStore = useGameStore()
const isShowModal = ref(false)
const selectedCategory = ref('All')

onMounted(async () => {
    await gameStore.fetchGames()
})

const toggleModal = () => {
    isShowModal.value = !isShowModal.value
}
const gameImages = [arcadeImage, controllerImage, gameConsoleImage, gamerImage, ghostImage, joystickImage, mushroomImage, pikachuImage]

const categories = [
    'All',
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
    'Others'
]

const handleOnCategorySelected = async (category) => {
    selectedCategory.value = category
    await gameStore.fetchGames(category)
}
</script>


<style scoped>
/* Custom scrollbar hide utility */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
    /* For Chrome, Safari, and Opera */
}

.scrollbar-hide {
    -ms-overflow-style: none;
    /* For Internet Explorer and Edge */
    scrollbar-width: none;
    /* For Firefox */
}
</style>