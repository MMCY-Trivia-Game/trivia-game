<template>
    <div class="w-full bg-secondary flex flex-col md:flex-row items-center justify-center h-screen">
        <div class="flex flex-col md:flex-row w-11/12 bg-white md:w-3/5 shadow-xl  p-20 rounded-2xl">

            <!--Vector animation start-->
            <div class="hidden md:block md:w-1/2">
                <img :src="loginSVG" alt="Login SVG" />
            </div>
            <!--Vector animation end-->

            <!--logo start-->
            <div class="block md:hidden md:w-1/2">
                <img :src="logo" alt="logo" />
            </div>
            <!--logo end-->

            <div class="md:w-1/2 text-white">
                <div class=" h-full ">
                    <h2 class="text-2xl font-semibold text-center mb-6">Login</h2>
                    <!-- Login Form -->
                    <form @submit="onSubmit" class="flex flex-col justify-between ">
                        <div class="w-100">
                            <div class="mb-4">
                                <!-- Email Input -->
                                <fwb-input v-model="email" :validation-status="errors.email ? `error` : ``" type="email"
                                    label="Email" placeholder="Enter your Email" size="lg" />
                                <p class="text-red-600 mb-5">{{ errors.email }}</p>

                                <!-- Password Input -->
                                <fwb-input v-model="password" :validation-status="errors.password ? `error` : ``"
                                    type="password" name="password" label="Password" placeholder="Enter your Password"
                                    size="lg" />

                                <p class="text-red-600">{{ errors.password }}</p>

                            </div>
                        </div>

                        <div class="w-100">

                            <div class="flex justify-end items-center mb-4">
                                <router-link :to="{ name: 'forget-password' }" class="text-sm text-primary ">Forgot
                                    password?
                                </router-link>
                            </div>



                            <fwb-button :disabled="authStore.isLoading"
                                class="w-full bg-primary hover:bg-secondary hover:text-white  text-white"
                                color="alternative" type="submit" size="lg">
                                <span v-if="!authStore.isLoading">Login</span>
                                <div v-if="authStore.isLoading" class="flex justify-center"><fwb-spinner size="6" /></div>
                            </fwb-button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import loginSVG from '@/assets/Secure-login.svg'
import logo from '@/assets/logo-highlight.png'
import toast from '@/components/admin-component/ui/ToastMessage'
import { FwbInput, FwbButton, FwbSpinner } from 'flowbite-vue'
import { useAuthStore } from '@/stores/auth/auth.js';
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from 'vue-router'
import * as z from 'zod'
import { onMounted } from 'vue';


const authStore = useAuthStore()
const router = useRouter();

onMounted(() => {
    if (authStore.isTokenValid()) {
        if (authStore.user.role === 'admin' && authStore.user.is_active) {
            router.push('/admin');
        }
        else if (authStore.user.role === 'creator' && authStore.user.is_active) {
            router.push('/creator');
        }
    }
})

const validationSchema = toTypedSchema(
    z.object({
        email: z.string()
            .email({ message: "Please provide a valid email address" }),
        password: z.string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .refine(value => /[0-9]/.test(value), { message: 'Password must contain at least one number' })
            .refine(value => /[A-Z]/.test(value), { message: 'Password must contain at least one uppercase letter' })
            .refine(value => /[a-z]/.test(value), { message: 'Password must contain at least one lowercase letter' })
            .refine(value => /[\W_]/.test(value), { message: 'Password must contain at least one special character' })

    })
)


const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: email } = useField('email')
const { value: password } = useField('password')

// Submit handler
const onSubmit = handleSubmit(async (value) => {
    const response = await authStore.login({
        email: value.email,
        password: value.password
    })

    if (response == true) {
        if (authStore.user.role === 'admin' && authStore.user.is_active) {
            router.push('/admin');
        }
        else if (authStore.user.role === 'creator' && authStore.user.is_active) {
            router.push('/creator');
        }
        else {
            toast("You don't have permission to access this content!", 'error')
        }

    } else {
        toast(response, 'error')
    }
});



</script>