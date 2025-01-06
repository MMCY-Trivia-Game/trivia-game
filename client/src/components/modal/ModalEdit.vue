<template>
    <fwb-modal v-if="isShowModal" @close="emitClose"
        class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <template #header>
            <div class="flex items-center text-lg text-primary">
                Edit User
            </div>
        </template>
        <template #body>
            <EditUserForm />
        </template>
        <template #footer>
            <div class="flex justify-end">
                <Button @click="emitClose" title="Save" type="submit">
                    Save
                </Button>
            </div>
        </template>
    </fwb-modal>
</template>

<script  setup>
import { FwbModal, FwbButton } from 'flowbite-vue'
import EditUserForm from '@/components/forms/EditUserForm.vue'
import Button from '@/components/ui/PrimaryButton.vue'
const { isShowModal } = defineProps(['isShowModal'])
const emit = defineEmits(['close', 'submit']);

function emitClose() {
    emit('close');
}



</script>