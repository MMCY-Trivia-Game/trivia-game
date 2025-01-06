<template>
    <div class="grid gap-4 mb-4 grid-cols-2">

        <div class="col-span-1">
            <FwbInput required placeholder="Enter user first name" label="First name" />
        </div>

        <div class="col-span-1">
            <FwbInput required placeholder="Enter user last name" label="Last name" />
        </div>

        <div class="col-span-2">
            <FwbInput type="email" required placeholder="Enter user email" label="Email" />
        </div>

        <div class="col-span-2">
            <fwb-select :options="roles" label="Select a role" />
        </div>

        <div class="col-span-1 flex items-end">
            <fwb-toggle v-model="toggle" label="Active" reverse />
        </div>

    </div>
</template>

<script setup>
import { FwbInput, FwbSelect, FwbToggle } from 'flowbite-vue'

const roles = [
    { value: 'admin', name: 'Admin' },
    { value: 'creator', name: 'Creator' },
]
</script>