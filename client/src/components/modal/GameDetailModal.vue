<template>
    <fwb-modal
        class="text-primary overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        v-if="isShowModal" @close="emitClose">
        <template #header>
            <div class=" flex items-center text-lg">
                Game Detail
            </div>
        </template>
        <template #body>
            <GameForm />
            <GameDeleteModal @close="toggleModal" :isShowModal="isDeleteShowModal" />
        </template>
        <template #footer>
            <div class="flex justify-end">
                <fwb-button @click="toggleModal" color="red">
                    Delete
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import GameDeleteModal from '@/components/modal/GameDeleteModal.vue'
import { FwbButton, FwbModal } from 'flowbite-vue'
import GameForm from "@/components/forms/GameForm.vue"
const { isShowModal } = defineProps(['isShowModal'])
const emit = defineEmits(['close', 'submit']);

function emitClose() {
    emit('close');
}

const isDeleteShowModal = ref(false)
const toggleModal = () => {
    isDeleteShowModal.value = !isDeleteShowModal.value
}


</script>