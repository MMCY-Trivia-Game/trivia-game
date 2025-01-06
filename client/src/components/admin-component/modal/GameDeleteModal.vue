<template>
    <fwb-modal size="xs" class="text-primary" v-if="isShowModal" @close="emitClose">
        <template #header>
            <div class="flex items-center text-lg">
                Delete game
            </div>
        </template>
        <template #body>
            <p class="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this game?
            </p>
        </template>
        <template #footer>
            <div class="flex justify-between">
                <fwb-button @click="emitClose" color="alternative">
                    Decline
                </fwb-button>
                <fwb-button @click="emitClose" color="red">
                    Delete
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>

<script lang="ts" setup>
import { FwbButton, FwbModal } from 'flowbite-vue'
const { isShowModal } = defineProps(['isShowModal'])
const emit = defineEmits(['close', 'submit']);

function emitClose() {
    emit('close');
}
</script>