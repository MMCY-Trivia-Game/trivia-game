<template>
    <button :type="type"
        class="text-white  bg-secondary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-secondary">
        {{ title }}
    </button>
</template>


<script setup>
const { title, type } = defineProps(['title', 'type'])
</script>