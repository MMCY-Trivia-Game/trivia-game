<template>
    <div class="w-full bg-secondary flex flex-col md:flex-row items-center justify-center h-screen">
        <div class="flex flex-col w-11/12 items-center bg-white md:w-3/5 shadow-xl  p-20 rounded-2xl">

            <!--Vector animation start-->
            <div class="w-full md:w-1/2">
                <img :src="forgetSVG" alt="Login SVG" />
            </div>
            <!--Vector animation end-->

            <div class="text-center">
                <div>
                    <h2 class="text-2xl font-semibold text-center mb-6">Password reset sent</h2>
                    <p class="text-sm">We’ve emailed you instructions for setting your password, if an account exists with
                        the email you
                        entered. You should receive them shortly. If you don’t receive an email, please make sure you’ve
                        entered the address you registered with, and check your spam folder.</p>

                    <fwb-button @click="router.push('/')"
                        class="mt-3 w-full md:w-1/2 bg-primary hover:bg-secondary hover:text-white  text-white"
                        color="alternative" type="submit" size="lg">
                        <span>Login</span>
                    </fwb-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import forgetSVG from '@/assets/success.gif'
import logo from '@/assets/logo-highlight.png'
import { FwbInput, FwbButton, FwbSpinner } from 'flowbite-vue'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import toast from '@/components/admin-component/ui/ToastMessage'
import * as z from 'zod'
import { useRouter } from 'vue-router'


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
});

</script>