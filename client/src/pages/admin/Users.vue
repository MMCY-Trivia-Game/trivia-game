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
                        <Button type="button" title="Search"></Button>
                    </div>

                </div>
            </div>
            <div class="mb-2 w-full block mt-3 md:m-0  text-end">
                <Button @click="toggleModal('post')" type="button" title="Add"></Button>
            </div>
        </div>


        <fwb-table v-if="!userStore.isLoading" class="mt-3" hoverable>
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
                        <div class="flex gap-3">
                            <PencilSquareIcon class="w-5 h-5 hover:scale-110 hover:text-secondary"
                                @click="toggleModal('put', user)" />
                            <TrashIcon class="w-5 h-5 hover:scale-110 hover:text-highlight" />
                        </div>
                    </fwb-table-cell>
                </fwb-table-row>

            </fwb-table-body>
        </fwb-table>
        <div class="flex justify-center items-center text-center">
            <fwb-spinner v-if="userStore.isLoading" size="10" color="purple" />
        </div>
        <div class="text-end p-3">
            <fwb-pagination class="mt-2" v-model="currentPage" :total-items="30"></fwb-pagination>
        </div>
    </div>


    <UserModal :form_type="modalOption.type" :form_errors="errors" v-model="formData" @submit="onSubmit"
        @close="toggleModal" :isShowModal="modalOption.isShowModal" />
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
    FwbBadge,
    FwbSpinner
} from 'flowbite-vue'
import UserModal from '@/components/admin-component/modal/UserModal.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { CheckCircleIcon, XCircleIcon, TrashIcon, PencilSquareIcon } from '@heroicons/vue/24/solid';
import Button from '@/components/admin-component/ui/PrimaryButton.vue'
import { useUsersStore } from '@/stores/admin/userStore.js';
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { reactive } from 'vue';
import toast from '@/components/admin-component/ui/ToastMessage'

const userStore = useUsersStore()
const currentPage = ref(1)
const modalOption = ref({
    isShowModal: false,
    type: null,
    user: null
})

onMounted(async () => {
    await userStore.fetchUsers()
})

const validationSchema = toTypedSchema(
    z.object({
        first_name: z.string()
            .min(1, { message: "first name is required" })
            .min(3, { message: "first name must be at least 3 characters long" }),
        last_name: z.string()
            .min(1, { message: "last name is required" })
            .min(3, { message: "last name must be at least 3 characters long" }),
        email: z.string()
            .email({ message: "Please provide a valid email address" }),
        role: z.string()
            .min(1, { message: "Please provide a role of user" }),
        password: z.string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .refine(value => /\d/.test(value), { message: 'Password must contain at least one number' })
            .refine(value => /[A-Z]/.test(value), { message: 'Password must contain at least one uppercase letter' })
            .refine(value => /[a-z]/.test(value), { message: 'Password must contain at least one lowercase letter' })
            .refine(value => /[\W_]/.test(value), { message: 'Password must contain at least one special character' }),
        confirm_password: z.string()
    })
        .refine(data => data.password === data.confirm_password, {
            message: "Passwords do not match",
            path: ["confirm_password"], // Specify where the error message should appear
        }))

const { handleSubmit, errors, setValues, resetForm } = useForm({
    validationSchema,
})

const { value: first_name } = useField('first_name')
const { value: last_name } = useField('last_name')
const { value: email } = useField('email')
const { value: role } = useField('role')
const { value: password } = useField('password')
const { value: confirm_password } = useField('confirm_password')

const formData = reactive({
    first_name,
    last_name,
    email,
    role,
    password,
    confirm_password
})

const toggleModal = (type = null, user = null) => {
    modalOption.value.isShowModal = !modalOption.value.isShowModal
    modalOption.value.type = type

    if (type == 'put') {
        setValues({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            password: '7o8p9q0r1sA@',
            confirm_password: '7o8p9q0r1sA@'
        });
        modalOption.value.user = user._id
    } else {
        resetForm()
    }
}

// Submit handler
const onSubmit = handleSubmit(async (value) => {

    if (modalOption.value.type == 'post') {
        const response = await userStore.addUser(value)

        if (response == true) {
            toast("Registration successful!", 'success')
            toggleModal()
        } else {
            toast(response, 'error')
        }
    } else {
        const formData = {
            _id: modalOption.value.user,
            first_name: value.first_name,
            last_name: value.last_name,
            email: value.email,
            role: value.role
        }
        const response = await userStore.updateUser(formData)
        if (response == true) {
            toast("successfully user updated!", 'success')
            toggleModal()
        } else {
            toast(response, 'error')
        }
    }

});


</script>