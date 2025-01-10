<template>
    <div class="bg-white p-5 rounded-md">
        <h3 class="text-primary mb-5 font-bold text-2xl">Users</h3>
        <div class="flex flex-col md:flex-row  justify-between items-center">
            <div class="w-full md:w-1/3 block ">
                <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <MagnifyingGlassIcon class="text-primary h-4 w-4" />
                    </div>
                    <input type="search" id="search"
                        class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                        placeholder="Search" required />

                    <div class="absolute end-2.5 bottom-2.5">
                        <Button @click="toggleModal" type="button" title="Search"></Button>
                    </div>

                </div>
            </div>
            <div class="mb-2 w-full block mt-3 md:m-0  text-end">
                <Button @click="toggleModal" type="button" title="Add"></Button>
            </div>
        </div>


        <fwb-table class="mt-3" hoverable>
            <fwb-table-head>
                <fwb-table-head-cell>#</fwb-table-head-cell>
                <fwb-table-head-cell>First Name</fwb-table-head-cell>
                <fwb-table-head-cell>Last Name</fwb-table-head-cell>
                <fwb-table-head-cell>Email</fwb-table-head-cell>
                <fwb-table-head-cell>Role</fwb-table-head-cell>
                <fwb-table-head-cell>Active</fwb-table-head-cell>
                <fwb-table-head-cell>
                    <span class="sr-only">Edit</span>
                </fwb-table-head-cell>
            </fwb-table-head>
            <fwb-table-body>

                <fwb-table-row v-for="user in userStore.users">
                    <fwb-table-cell>1</fwb-table-cell>
                    <fwb-table-cell>{{ user.first_name }}</fwb-table-cell>
                    <fwb-table-cell>{{ user.last_name }}</fwb-table-cell>
                    <fwb-table-cell>{{ user.email }}</fwb-table-cell>
                    <fwb-table-cell class="capitalize">
                        <fwb-badge v-if="user.role == 'admin'"> {{ user.role }}</fwb-badge>
                        <fwb-badge v-else type="dark"> {{ user.role }}</fwb-badge>
                    </fwb-table-cell>
                    <fwb-table-cell>
                        <CheckCircleIcon v-if="user.is_active" class="h-6 w-6 text-green-500" />
                        <XCircleIcon v-else class="h-6 w-6 text-highlight" />
                    </fwb-table-cell>
                    <fwb-table-cell>
                        <fwb-a @click="toggleModal" href="#">
                            Edit
                        </fwb-a>
                    </fwb-table-cell>
                </fwb-table-row>

            </fwb-table-body>
        </fwb-table>
        <div class="text-end p-3">
            <fwb-pagination class="mt-2" v-model="currentPage" :total-items="30"></fwb-pagination>
        </div>
    </div>

    <ModalEdit @close="toggleModal" :isShowModal="isShowModal" />
</template>

<script setup>

import { onMounted, ref } from 'vue'
import {
    FwbA,
    FwbTable,
    FwbTableBody,
    FwbTableCell,
    FwbTableHead,
    FwbTableHeadCell,
    FwbTableRow,
    FwbPagination,
    FwbButton,
    FwbBadge
} from 'flowbite-vue'
import ModalEdit from '@/components/admin-component/modal/ModalEdit.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';
import Button from '@/components/admin-component/ui/PrimaryButton.vue'
import { useUsersStore } from '@/stores/admin/userStore.js';

const userStore = useUsersStore()
const currentPage = ref(1)
const isShowModal = ref(false)

onMounted(async () => {
    await userStore.fetchUsers()
})

const toggleModal = () => {
    isShowModal.value = !isShowModal.value
}


</script>