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

            <div class="grid gap-4 mb-4 grid-cols-2 text-black">

                <div class="col-span-1">
                    <small class="text-gray-500">Title</small>
                    <p>{{ game.title }}</p>
                </div>

                <div class="col-span-1">
                    <small class="text-gray-500">Created By</small>
                    <p>{{ game.creator_id.first_name }} {{ game.creator_id.last_name }}</p>
                </div>

                <div class="col-span-1">
                    <small class="text-gray-500">Category</small>
                    <p>{{ game.category }}</p>
                </div>

                <div class="col-span-1">
                    <small class="text-gray-500">Max Users</small>
                    <p>{{ game.maxUsers }}</p>
                </div>

                <div class="col-span-1">
                    <small class="text-gray-500">Game Code</small>
                    <p>{{ game.game_code }}</p>
                </div>

                <div class="col-span-1">
                    <small class="text-gray-500">Active</small>
                    <p>
                        <span v-if="game.is_active"
                            class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold bg-green-400 rounded-full">
                        </span>
                        <span v-else
                            class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold bg-red-400 rounded-full">
                        </span>
                    </p>

                </div>

            </div>


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
import GameDeleteModal from '@/components/admin-component/modal/GameDeleteModal.vue'
import { FwbButton, FwbModal } from 'flowbite-vue'

const { isShowModal, game } = defineProps(['isShowModal', 'game'])
const emit = defineEmits(['close', 'submit']);

function emitClose() {
    emit('close');
}

const isDeleteShowModal = ref(false)
const toggleModal = () => {
    isDeleteShowModal.value = !isDeleteShowModal.value
}


</script>