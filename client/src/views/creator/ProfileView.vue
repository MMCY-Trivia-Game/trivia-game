<script setup>
import { ref, computed, onMounted } from "vue";
import NavBar from "@/components/creator/NavBar.vue";
import { useAuthStore } from '@/stores/auth/auth.js';
import toast from '@/components/admin-component/ui/ToastMessage'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FwbTab, FwbTabs, FlowbiteThemable, FwbSpinner } from 'flowbite-vue'
import { useRouter } from 'vue-router'

const userStore = useAuthStore()
const router = useRouter();
const activeTab = ref('first')
const theme = 'red'

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

<template>
  <div class="min-h-screen bg-primary text-white">
    <NavBar />
    <div class="p-6 flex flex-col items-center">
      <flowbite-themable :theme="theme">
        <fwb-tabs v-model="activeTab" variant="underline" class="w-full text-white">
          <fwb-tab name="first" title="User Information" class="bg-green-500">
            <form @submit="onSubmit" class="flex flex-col items-center p-6 justify-center">
              <div
                class="w-24 uppercase h-24 bg-secondary flex items-center justify-center rounded-full text-4xl font-bold text-white mb-6">
                {{ first_name ? first_name.charAt(0) : '' }}
              </div>

              <div class="w-full max-w-md space-y-4">
                <div>
                  <label for="firstName" class="block text-lg font-medium mb-1">First Name</label>
                  <input id="firstName" type="text" v-model="first_name"
                    class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent" />
                  <p class="text-red-600 mb-5">{{ errors.first_name }}</p>
                </div>

                <div>
                  <label for="lastName" class="block text-lg font-medium mb-1">Last Name</label>
                  <input id="lastName" type="text" v-model="last_name"
                    class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent" />
                  <p class="text-red-600 mb-5">{{ errors.last_name }}</p>
                </div>

                <div>
                  <label for="email" class="block text-lg font-medium mb-1">Email</label>
                  <input id="email" type="email" v-model="email"
                    class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent" />
                  <p class="text-red-600 mb-5">{{ errors.email }}</p>

                </div>


                <div class="mt-6 text-center">
                  <button :disabled="userStore.isLoading" type="submit"
                    class="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-600">
                    <span v-if="!userStore.isLoading">Update-Info
                    </span>
                    <div v-if="userStore.isLoading" class="flex justify-center">
                      <fwb-spinner size="6" />
                    </div>
                  </button>
                </div>




              </div>
            </form>
          </fwb-tab>
          <fwb-tab name="second" title="Password">
            <form @submit="onPasswordSubmit" class="flex flex-col items-center p-6 justify-center">
              <div
                class="w-24 uppercase h-24 bg-secondary flex items-center justify-center rounded-full text-4xl font-bold text-white mb-6">
                {{ first_name ? first_name.charAt(0) : '' }}
              </div>

              <div class="w-full max-w-md space-y-4">

                <div>
                  <label for="password" class="block text-lg font-medium mb-1">Old Password</label>
                  <input id="password" type="password" v-model="old_password" placeholder="Enter old password"
                    class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent" />
                  <p class="text-red-600 mb-5">{{ passwordErrors.old_password }}</p>
                </div>

                <div>
                  <label for="password" class="block text-lg font-medium mb-1">New Password</label>
                  <input id="password" type="password" v-model="password" placeholder="Enter new password"
                    class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent" />
                  <p class="text-red-600 mb-5">{{ passwordErrors.password }}</p>
                </div>

                <div>
                  <label for="confirmPassword" class="block text-lg font-medium mb-1">Confirm Password</label>
                  <input id="confirmPassword" type="password" v-model="confirm_password"
                    placeholder="Confirm new password"
                    class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent" />
                  <p class="text-red-600 mb-5">{{ passwordErrors.confirm_password }}</p>
                </div>

                <div class="mt-6 text-center">
                  <button :disabled="userStore.isLoading" type="submit"
                    class="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-600">
                    <span v-if="!userStore.isLoading">Update-Password
                    </span>
                    <div v-if="userStore.isLoading" class="flex justify-center">
                      <fwb-spinner size="6" />
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </fwb-tab>
        </fwb-tabs>
      </flowbite-themable>
    </div>


  </div>
</template>
