<template>
    <form @submit.prevent="emitSubmit">
        <fwb-modal v-if="isShowModal" @close="emitClose"
            class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <template #header>
                <div class="flex items-center text-lg text-primary">
                    <p v-if="form_type == 'post'">Add User</p>
                    <p v-else-if="form_type == 'put'">Edit User</p>
                </div>
            </template>

            <template #body>
                <EditUserForm v-model="model" :form_type="form_type" :form_errors="form_errors" />
            </template>
            <template #footer>
                <div class="flex justify-end">

                    <fwb-button :disabled="userStore.isLoading"
                        class="w-full bg-primary hover:bg-secondary hover:text-white  text-white" color="alternative"
                        type="submit" size="lg">
                        <span v-if="!userStore.isLoading">{{ form_type == 'post' ? 'Add' : 'Update' }}</span>
                        <div v-if="userStore.isLoading" class="flex justify-center"><fwb-spinner size="6" /></div>
                    </fwb-button>

                </div>
            </template>
        </fwb-modal>
    </form>
</template>

<script  setup>

import { FwbModal, FwbButton, FwbSpinner } from 'flowbite-vue'
import EditUserForm from '@/components/admin-component/forms/EditUserForm.vue'
import { useUsersStore } from '@/stores/admin/userStore.js';


const userStore = useUsersStore()

const { form_type, isShowModal, form_errors } = defineProps(['form_type', 'isShowModal', 'onSubmit', 'form_errors'])


const model = defineModel({ required: true }) //form data

const emit = defineEmits(['close', 'submit']);


function emitClose() {
    emit('close');
}

function emitSubmit() {
    emit('submit')
}




</script>