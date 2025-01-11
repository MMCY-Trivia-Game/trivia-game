<template>
    <div class="grid gap-4 mb-4 grid-cols-2">

        <div class="col-span-1">
            <FwbInput :validation-status="form_errors.first_name ? `error` : ``" v-model="model.first_name" required
                placeholder="Enter user first name" label="First name" />
            <p class="text-red-600 mb-5">{{ form_errors.first_name }}</p>
        </div>

        <div class="col-span-1">
            <FwbInput :validation-status="form_errors.last_name ? `error` : ``" v-model="model.last_name" required
                placeholder="Enter user last name" label="Last name" />
            <p class="text-red-600 mb-5">{{ form_errors.last_name }}</p>
        </div>

        <div class="col-span-2">
            <FwbInput :validation-status="form_errors.email ? `error` : ``" v-model="model.email" type="email" required
                placeholder="Enter user email" label="Email" />
            <p class="text-red-600 mb-5">{{ form_errors.email }}</p>
        </div>

        <div class="col-span-2">
            <fwb-select :validation-status="form_errors.role ? `error` : ``" v-model="model.role" :options="roles"
                label="Select a role" />
            <p class="text-red-600 mb-5">{{ form_errors.role }}</p>
        </div>

        <div class="col-span-2" v-if="form_type == 'post'">
            <FwbInput :validation-status="form_errors.password ? `error` : ``" v-model="model.password" type="password"
                required placeholder="Enter user password" label="Password" />
            <p class="text-red-600 mb-5">{{ form_errors.password }}</p>
        </div>
        <div class="col-span-2" v-if="form_type == 'post'">
            <FwbInput :validation-status="form_errors.confirm_password ? `error` : ``" v-model="model.confirm_password"
                type="password" required placeholder="confirm password" label="Confirm password" />
            <p class="text-red-600 mb-5">{{ form_errors.confirm_password }}</p>
        </div>

        <div class="col-span-2">
            <fwb-toggle v-model="model.is_active" label="Active" />
        </div>


    </div>
</template>

<script setup>
import { FwbInput, FwbSelect, FwbToggle } from 'flowbite-vue'
const model = defineModel({ required: true })
const { form_errors, form_type } = defineProps(['form_errors', 'form_type'])

const roles = [
    { value: 'admin', name: 'Admin' },
    { value: 'creator', name: 'Creator' },
]
</script>