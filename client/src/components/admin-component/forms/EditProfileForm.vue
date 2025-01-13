<template>
    <div class="p-5 rounded-md bg-white text-primary">
        <h3 class="text-primary mb-5 font-bold text-2xl">Profile</h3>
        <fwb-tabs v-model="activeTab" class="p-5">
            <fwb-tab name="User-Info" title="User Info">
                <form @submit="onSubmit">
                    <div class="mt-3 grid gap-4 mb-4 grid-cols-2">

                        <div class="col-span-1">
                            <FwbInput :validation-status="errors.first_name ? `error` : ``" v-model="first_name" required
                                placeholder="Enter user first name" label="First name" />
                            <p class="text-red-600 mb-5">{{ errors.first_name }}</p>
                        </div>

                        <div class="col-span-1">
                            <FwbInput :validation-status="errors.last_name ? `error` : ``" v-model="last_name" required
                                placeholder="Enter user last name" label="Last name" />
                            <p class="text-red-600 mb-5">{{ errors.last_name }}</p>
                        </div>

                        <div class="col-span-2">
                            <FwbInput :validation-status="errors.email ? `error` : ``" v-model="email" type="email" required
                                placeholder="Enter user email" label="Email" />
                            <p class="text-red-600 mb-5">{{ errors.email }}</p>
                        </div>

                        <div class="flex gap-3">
                            <fwb-button :disabled="userStore.isLoading"
                                class="hover:text-white text-white bg-primary hover:bg-secondary" color="alternative"
                                type="submit" size="lg">
                                <span v-if="!userStore.isLoading">Update
                                </span>
                                <div v-if="userStore.isLoading" class="flex justify-center"><fwb-spinner size="6" /></div>
                            </fwb-button>
                        </div>

                    </div>
                </form>
            </fwb-tab>
            <fwb-tab name="Password" title="Password">
                <form @submit="onPasswordSubmit">
                    <div class="mt-3 grid gap-4 mb-4 grid-cols-1">
                        <div class="col-span-2">
                            <FwbInput :validation-status="passwordErrors.old_password ? `error` : ``" v-model="old_password"
                                type="password" required placeholder="Enter user password" label="Old password" />
                            <p class="text-red-600 mb-5">{{ passwordErrors.old_password }}</p>
                        </div>

                        <div class="col-span-2">
                            <FwbInput :validation-status="passwordErrors.password ? `error` : ``" v-model="password"
                                type="password" required placeholder="Enter user password" label="Password" />
                            <p class="text-red-600 mb-5">{{ passwordErrors.password }}</p>
                        </div>
                        <div class="col-span-2">
                            <FwbInput :validation-status="passwordErrors.confirm_password ? `error` : ``"
                                v-model="confirm_password" type="password" required placeholder="confirm password"
                                label="Confirm password" />
                            <p class="text-red-600 mb-5">{{ passwordErrors.confirm_password }}</p>
                        </div>

                        <div class="flex gap-3">
                            <Button title="Update"></Button>
                        </div>

                    </div>
                </form>
            </fwb-tab>

        </fwb-tabs>


    </div>
</template>

<script setup>
import { ref } from 'vue'
import { FwbInput, FwbButton, FwbTab, FwbTabs, FwbSpinner } from 'flowbite-vue'
import Button from '@/components/admin-component/ui/PrimaryButton.vue'
import toast from '@/components/admin-component/ui/ToastMessage'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useAuthStore } from '@/stores/auth/auth.js';
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'


const userStore = useAuthStore()
const router = useRouter();

const userInfoValidationSchema = toTypedSchema(
    z.object({
        first_name: z.string()
            .min(1, { message: "First name is required" })
            .min(3, { message: "First name must be at least 3 characters long" }),
        last_name: z.string()
            .min(1, { message: "Last name is required" })
            .min(3, { message: "Last name must be at least 3 characters long" }),
        email: z.string()
            .email({ message: "Please provide a valid email address" }),
    })
);

const userPasswordValidationSchema = toTypedSchema(
    z.object({
        old_password: z.string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .refine(value => /\d/.test(value), { message: 'Password must contain at least one number' })
            .refine(value => /[A-Z]/.test(value), { message: 'Password must contain at least one uppercase letter' })
            .refine(value => /[a-z]/.test(value), { message: 'Password must contain at least one lowercase letter' })
            .refine(value => /[\W_]/.test(value), { message: 'Password must contain at least one special character' }),
        password: z.string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .refine(value => /\d/.test(value), { message: 'Password must contain at least one number' })
            .refine(value => /[A-Z]/.test(value), { message: 'Password must contain at least one uppercase letter' })
            .refine(value => /[a-z]/.test(value), { message: 'Password must contain at least one lowercase letter' })
            .refine(value => /[\W_]/.test(value), { message: 'Password must contain at least one special character' }),
        confirm_password: z.string(),
    })
        .refine(data => data.password === data.confirm_password, {
            message: "Passwords do not match",
            path: ["confirm_password"],
        })
)

const { handleSubmit, setValues, errors } = useForm({
    validationSchema: userInfoValidationSchema
})

const { value: first_name } = useField('first_name')
const { value: last_name } = useField('last_name')
const { value: email } = useField('email')

const { handleSubmit: handlePasswordSubmit, errors: passwordErrors } = useForm({
    validationSchema: userPasswordValidationSchema
})

const { value: old_password } = useField('old_password')
const { value: password } = useField('password')
const { value: confirm_password } = useField('confirm_password')

onMounted(() => {
    setValues({
        first_name: userStore.user.first_name,
        last_name: userStore.user.last_name,
        email: userStore.user.email
    })
})



const activeTab = ref('User-Info')

const onSubmit = handleSubmit(async (value) => {
    const response = await userStore.updateProfileInfo(value)

    if (response == true) {
        toast("Profile updated successful!", 'success')
    } else {
        toast(response, 'error')
    }
})

const onPasswordSubmit = handlePasswordSubmit(async (value) => {
    const response = await userStore.updatePassword({
        oldPassword: value.old_password,
        newPassword: value.password
    })

    if (response == true) {
        toast("Password updated successful!", 'success')
        setTimeout(() => {
            userStore.logout()
            router.push('/');
        }, 3000)

    } else {
        toast(response, 'error')
    }
})

</script>