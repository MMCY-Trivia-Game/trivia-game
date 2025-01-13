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


            <GameDeactivateModal :title="game.title" @submit="handleOnDeactivate" :isLoading="gameStore.isLoading"
                @close="toggleModal" :isShowModal="isDeleteShowModal" />
            <GameActivateModal :title="game.title" @submit="handleOnActivate" :isLoading="gameStore.isLoading"
                @close="toggleActivateModal" :isShowModal="isActivateShowModal" />
        </template>
        <template #footer>
            <div class="flex justify-end">
                <fwb-button v-if="game.is_active" @click="toggleModal" color="red">
                    Deactivate
                </fwb-button>

                <fwb-button v-else @click="toggleActivateModal"
                    class=" hover:text-white text-white bg-primary hover:bg-secondary" type="submit" size="lg"> Activate
                </fwb-button>
            </div>
        </template>
    </fwb-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import GameDeactivateModal from '@/components/admin-component/modal/GameDeactivateModal.vue'
import GameActivateModal from '@/components/admin-component/modal/GameActivateModal.vue'
import { FwbButton, FwbModal } from 'flowbite-vue'
import toast from '@/components/admin-component/ui/ToastMessage'
import { useGameStore } from '@/stores/admin/gameStore';


const gameStore = useGameStore()

const { isShowModal, game } = defineProps(['isShowModal', 'game'])
const emit = defineEmits(['close', 'submit']);

function emitClose() {
    emit('close');
}

const isDeleteShowModal = ref(false)
const isActivateShowModal = ref(false)

const toggleModal = () => {
    isDeleteShowModal.value = !isDeleteShowModal.value
}

const toggleActivateModal = () => {
    isActivateShowModal.value = !isActivateShowModal.value
}

const handleOnDeactivate = async () => {
    const response = await gameStore.deactivate(game._id)

    if (response) {
        toggleModal()
        emitClose()
        toast("Game deactivated successfully!", 'success')
        return
    }

    toast(response, 'error')

}

const handleOnActivate = async () => {
    const response = await gameStore.activate(game._id)

    if (response) {
        toggleActivateModal()
        emitClose()
        toast("Game activated successfully!", 'success')
        return
    }

    toast(response, 'error')

}


</script>