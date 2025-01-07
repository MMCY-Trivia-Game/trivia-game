<template>
    <div class="bg-white p-5 rounded-md">
        <h3 class="text-primary mb-5 font-bold text-2xl">Users</h3>
        <div class="flex justify-between items-center">
            <div class="mb-2 w-full md:w-1/3">
                <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <MagnifyingGlassIcon class="text-primary h-4 w-4" />
                    </div>
                    <input type="search" id="search"
                        class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
                        placeholder="Search" required />

                    <div class="absolute end-2.5 bottom-2.5">
                        <FwbButton color="light">Search</FwbButton>
                    </div>

                </div>
            </div>
            <div class="mb-2 w-full md:w-1/3 text-end">
                <Button @click="toggleModal" type="button" title="Add"></Button>
            </div>
        </div>


        <fwb-table hoverable>
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

                <fwb-table-row>
                    <fwb-table-cell>1</fwb-table-cell>
                    <fwb-table-cell>Abel</fwb-table-cell>
                    <fwb-table-cell>Yohannes</fwb-table-cell>
                    <fwb-table-cell>abel@gmail.ccom</fwb-table-cell>
                    <fwb-table-cell>Admin</fwb-table-cell>
                    <fwb-table-cell>
                        <CheckCircleIcon class="h-6 w-6 text-green-500" />
                    </fwb-table-cell>
                    <fwb-table-cell>
                        <fwb-a @click="toggleModal" href="#">
                            Edit
                        </fwb-a>
                    </fwb-table-cell>
                </fwb-table-row>


                <fwb-table-row>
                    <fwb-table-cell>2</fwb-table-cell>
                    <fwb-table-cell>Kaleab</fwb-table-cell>
                    <fwb-table-cell>Hegie</fwb-table-cell>
                    <fwb-table-cell>kal@gmail.ccom</fwb-table-cell>
                    <fwb-table-cell>Creator</fwb-table-cell>
                    <fwb-table-cell>
                        <XCircleIcon class="h-6 w-6 text-highlight" />
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

import { ref } from 'vue'
import {
    FwbA,
    FwbTable,
    FwbTableBody,
    FwbTableCell,
    FwbTableHead,
    FwbTableHeadCell,
    FwbTableRow,
    FwbPagination,
    FwbButton
} from 'flowbite-vue'
import ModalEdit from '@/components/admin-component/modal/ModalEdit.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';
import Button from '@/components/admin-component/ui/PrimaryButton.vue'



const currentPage = ref(1)
const isShowModal = ref(false)

const toggleModal = () => {
    isShowModal.value = !isShowModal.value
}


</script>