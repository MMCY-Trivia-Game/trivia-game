<template>
    <fwb-modal size="xs" class="text-primary" v-if="isShowModal" @close="emitClose">
        <template #header>
            <div class="flex items-center text-lg">
                Delete game
            </div>
        </template>
        <template #body>
            <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Are you sure you want to deactivate <span class="font-bold">{{ title }}</span> ?
            </p>
        </template>
        <template #footer>
            <div class="flex justify-between">
                <fwb-button @click="emitClose" color="alternative">
                    Decline
                </fwb-button>
                <fwb-button :disabled="isLoading" @click="emitSubmit"
                    class=" hover:text-white text-white bg-highlight hover:bg-accent" color="alternative" type="submit"
                    size="lg"> Deactivate
                    <div v-if="isLoading" class="flex justify-center"><fwb-spinner size="6" /></div>
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>

<script lang="ts" setup>
import { FwbButton, FwbModal, FwbSpinner } from 'flowbite-vue'
const { isShowModal, title, isLoading } = defineProps(['isShowModal', 'title', 'isLoading'])
const emit = defineEmits(['close', 'submit']);

function emitClose() {
    emit('close');
}

function emitSubmit() {
    emit('submit');
}
</script>