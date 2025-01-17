<template>
    <div class="w-full bg-secondary flex flex-col md:flex-row items-center justify-center h-screen">
        <div class="flex flex-col md:flex-row w-11/12 bg-white md:w-3/5 shadow-xl  p-20 rounded-2xl">

            <!--Vector animation start-->
            <div class="hidden md:block md:w-1/2">
                <img :src="forgetSVG" alt="Login SVG" />
            </div>
            <!--Vector animation end-->

            <!--logo start-->
            <div class="block md:hidden md:w-1/2">
                <img :src="logo" alt="logo" />
            </div>
            <!--logo end-->

            <div class="md:w-1/2 text-white">
                <div>
                    <h2 class="text-2xl font-semibold text-center mb-6 text-primary">New Password</h2>
                    <!-- Login Form -->
                    <form @submit="onSubmit">
                        <div class="mb-4">

                            <!-- Password Input -->
                            <fwb-input v-model="password" :validation-status="errors.password ? `error` : ``"
                                type="password" name="password" label="New Password" placeholder="Enter your Password"
                                size="lg" />

                            <p class="text-red-600 mb-3">{{ errors.password }}</p>

                            <!--confirm Password Input -->
                            <fwb-input v-model="confirm_password" :validation-status="errors.password ? `error` : ``"
                                type="password" name="New password" label="Confirm password"
                                placeholder="Enter your Password" size="lg" />

                            <p class="text-red-600">{{ errors.confirm_password }}</p>

                        </div>

                        <div class="text-end">
                            <router-link :to="{ name: 'login' }" class="text-sm mb-3 text-primary ">
                                Back to Login
                            </router-link>
                        </div>


                        <fwb-button :disabled="authStore.isLoading"
                            class="w-full bg-primary hover:bg-secondary hover:text-white  text-white" color="alternative"
                            type="submit" size="lg">
                            <span v-if="!authStore.isLoading">Reset</span>
                            <div v-if="authStore.isLoading" class="flex justify-center"><fwb-spinner size="6" /></div>
                        </fwb-button>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import forgetSVG from '@/assets/Reset password-cuate.svg'
import logo from '@/assets/logo-highlight.png'
import { FwbInput, FwbButton, FwbSpinner } from 'flowbite-vue'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth.js';
import * as z from 'zod'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'


const router = useRouter();
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
    const response = await authStore.checkPasswordTokenValidity(route.params.token)
    console.log(response, 'token')
})

const validationSchema = toTypedSchema(
    z.object({
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
);

const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: password } = useField('password')
const { value: confirm_password } = useField('confirm_password')

// Submit handler
const onSubmit = handleSubmit(async (value) => {
    console.log('new password', value)
});

</script>