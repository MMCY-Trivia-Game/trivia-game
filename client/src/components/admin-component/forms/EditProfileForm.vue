<template>
    <div class="p-5 rounded-md bg-white text-primary">
        <h1 class=" mt-3 text-3xl font-bold ">Edit Profile</h1>
        <fwb-tabs v-model="activeTab" class="p-5">
            <fwb-tab name="User-Info" title="User-Info">
                <div class="mt-3 grid gap-4 mb-4 grid-cols-2">

                    <div class="col-span-1">
                        <FwbInput required placeholder="Enter user first name" label="First name" />
                    </div>

                    <div class="col-span-1">
                        <FwbInput required placeholder="Enter user last name" label="Last name" />
                    </div>

                    <div class="col-span-2">
                        <FwbInput type="email" required placeholder="Enter user email" label="Email" />
                    </div>

                    <div class="flex gap-3">
                        <FwbButton color="light">cancel</FwbButton>
                        <Button title="Update"></Button>
                    </div>

                </div>
            </fwb-tab>
            <fwb-tab name="Password" title="Password">
                <div class="mt-3 grid gap-4 mb-4 grid-cols-1">

                    <div class="col-span-1">
                        <FwbInput required type="password" placeholder="Enter old password" label="Old Password" />
                    </div>

                    <div class="col-span-1">
                        <FwbInput required type="password" placeholder="Enter new password" label="New Password" />
                    </div>

                    <div class="col-span-1">
                        <FwbInput required type="password" placeholder="confirm password" label="Confirm New Password:" />
                    </div>

                    <div class="flex gap-3">
                        <FwbButton color="light">cancel</FwbButton>
                        <Button title="Update"></Button>
                    </div>

                </div>
            </fwb-tab>

        </fwb-tabs>


    </div>
</template>

<script setup>
import { ref } from 'vue'
import { FwbInput, FwbButton, FwbTab, FwbTabs } from 'flowbite-vue'
import Button from '@/components/admin-component/ui/PrimaryButton.vue'

const activeTab = ref('User-Info')
</script>