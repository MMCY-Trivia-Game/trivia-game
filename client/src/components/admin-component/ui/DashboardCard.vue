<template>
    <fwb-card>
        <div class="p-5">
            <component :is="icon" class="h-9 w-9 text-primary" />
            <p class="text-primary">{{ title }}</p>
            <h1 class="text-4xl text-primary font-bold">{{ number }}</h1>
        </div>
    </fwb-card>
</template>

<script setup>
import { FwbCard } from 'flowbite-vue'

const { title, icon, number } = defineProps(['title', 'icon', 'number'])

</script>