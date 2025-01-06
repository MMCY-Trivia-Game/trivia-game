<template>
    <fwb-card img-alt="Desk" :img-src="image" variant="horizontal">
        <div class="p-5">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {{ title }}
            </h5>
            <h1 class="font-bold text-4xl text-primary dark:text-gray-400">
                {{ number }}
            </h1>
        </div>
    </fwb-card>
</template>

<script setup>
import { FwbCard } from 'flowbite-vue'
const { title, image, number } = defineProps(['title', 'image', 'number'])
</script>