<template>
    <div
        class="flex flex-col p-5 bg-secondary border border-white text-white justify-between h-40 rounded-md transform transition-transform duration-300 hover:scale-105">
        <div class="">
            <fwb-tooltip>
                <template #trigger>
                    <button>
                        <p class="flex-grow text-start overflow-hidden text-ellipsis line-clamp-2">
                            {{ title }}
                        </p>
                    </button>
                </template>
                <template #content>
                    {{ title }}
                </template>
            </fwb-tooltip>
        </div>


        <div class="text-gray-400">
            By {{ creator }}
        </div>
        <div>
            <span v-if="active"
                class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold bg-green-400 rounded-full">
            </span>
            <span v-else
                class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold bg-red-400 rounded-full">
            </span>
        </div>

    </div>
</template>



<script setup>
import { FwbTooltip } from 'flowbite-vue'
const { title, image, active, creator } = defineProps(['title', 'image', 'active', 'creator'])



</script>