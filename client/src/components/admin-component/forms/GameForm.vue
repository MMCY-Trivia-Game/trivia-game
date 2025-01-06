<template>
    <div class="grid gap-4 mb-4 grid-cols-2">

        <div class="col-span-1">
            <FwbInput v-model="formData.title" disabled label="Title" />
        </div>

        <div class="col-span-1">
            <FwbInput v-model="formData.createdBy" disabled label="Created by" />
        </div>

        <div class="col-span-2">
            <fwb-select v-model="formData.category" disabled :options="categories" label="Category" />
        </div>

        <div class="col-span-1">
            <FwbInput v-model="formData.maxUser" disabled label="Max user" />
        </div>

        <div class="col-span-1">
            <FwbInput v-model="formData.code" disabled label="Code" />
        </div>

        <div class="col-span-1 flex items-end">
            <fwb-toggle v-model="formData.active" disabled label="Active" reverse />
        </div>

    </div>
</template>

<script setup>
import { FwbInput, FwbSelect, FwbToggle } from 'flowbite-vue'
import { ref } from 'vue';

const formData = ref({
    title: 'Fun',
    createdBy: 'User1',
    category: 'technology',
    maxUser: 10,
    code: '112-334',
    active: false
})

const categories = [
    { value: 'fun', name: 'Fun' },
    { value: 'technology', name: 'Technology' },
]
</script>