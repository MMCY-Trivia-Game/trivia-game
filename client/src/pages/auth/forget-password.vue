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
                    <h2 class="text-2xl font-semibold text-center mb-6">Reset Password</h2>
                    <!-- Login Form -->
                    <form @submit="onSubmit">
                        <div class="mb-4">
                            <!-- Email Input -->
                            <fwb-input v-model="email" type="email" label="Email" placeholder="Enter your Email"
                                size="lg" />
                            <p class="text-red-600 mb-5">{{ errors.email }}</p>

                        </div>

                        <div class="text-end">
                            <router-link :to="{ name: 'login' }" class="text-sm mb-3 text-primary ">
                                Back to Login
                            </router-link>
                        </div>

                        <fwb-button class="w-full mt-3 bg-primary hover:bg-secondary hover:text-white  text-white"
                            color="alternative" type="submit" size="lg">
                            <span>Send reset password</span>
                            <!-- <div v-if="authStore.isLoading" class="flex justify-center"><fwb-spinner size="6" /></div> -->
                        </fwb-button>

                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import forgetSVG from '@/assets/Reset password-cuate.svg'
import logo from '@/assets/logo-highlight.png'
import { FwbInput, FwbButton, FwbSpinner } from 'flowbite-vue'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from 'vue-router'
import * as z from 'zod'


const router = useRouter();

const validationSchema = toTypedSchema(
    z.object({
        email: z.string()
            .email({ message: "Please provide a valid email address" }),
    })
)

const { handleSubmit, errors } = useForm({
    validationSchema
})

const { value: email } = useField('email')

// Submit handler
const onSubmit = handleSubmit(async (value) => {
    console.log('reset for submitted!', value)
    router.push('/password-reset-sent');
});

</script>