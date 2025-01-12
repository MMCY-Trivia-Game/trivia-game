<template>
    <fwb-card class="p-2 hover:bg-slate-200 transform transition-transform duration-300 hover:scale-105" :img-alt="title"
        :img-src="image" variant="image">
        <div class="p-2">
            <fwb-tooltip>
                <template #trigger>
                    <button>
                        <p class="font-normal w-20 text-gray-700 dark:text-gray-400 truncate overflow-hidden">
                            {{ title }}
                        </p>
                    </button>
                </template>
                <template #content>
                    {{ title }}
                </template>
            </fwb-tooltip>
            <fwb-badge :type="active ? 'green' : 'default'">{{ active ? 'Active' : 'Not Active' }}</fwb-badge>
        </div>
    </fwb-card>
</template>

<script setup>
import { FwbCard, FwbTooltip, FwbBadge, FwbButton } from 'flowbite-vue'
const { title, image, active } = defineProps(['title', 'image', 'active'])



</script>