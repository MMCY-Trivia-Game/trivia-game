<script setup>
import { ref, computed } from "vue";
import NavBar from "@/components/creator/NavBar.vue";

const user = ref({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "Creator",
});

const password = ref("");
const confirmPassword = ref("");

const isChangePasswordEnabled = computed(() => {
  return password.value.trim() !== "" && confirmPassword.value.trim() !== "";
});

const changePassword = () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  alert("Password changed successfully!");
  password.value = "";
  confirmPassword.value = "";
};
</script>

<template>
  <div class="min-h-screen bg-primary text-white">
    <NavBar />
    <div class="p-6 flex flex-col items-center">
      <div
        class="w-24 h-24 bg-secondary flex items-center justify-center rounded-full text-4xl font-bold text-white mb-6"
      >
        {{ user.firstName.charAt(0) }}
      </div>

      <div class="w-full max-w-md space-y-4">
        <div>
          <label for="firstName" class="block text-lg font-medium mb-1"
            >First Name</label
          >
          <input
            id="firstName"
            type="text"
            :value="user.firstName"
            disabled
            class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label for="lastName" class="block text-lg font-medium mb-1"
            >Last Name</label
          >
          <input
            id="lastName"
            type="text"
            :value="user.lastName"
            disabled
            class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label for="email" class="block text-lg font-medium mb-1"
            >Email</label
          >
          <input
            id="email"
            type="email"
            :value="user.email"
            disabled
            class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label for="role" class="block text-lg font-medium mb-1">Role</label>
          <input
            id="role"
            type="text"
            :value="user.role"
            disabled
            class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label for="password" class="block text-lg font-medium mb-1"
            >New Password</label
          >
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter new password"
            class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-lg font-medium mb-1"
            >Confirm Password</label
          >
          <input
            id="confirmPassword"
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm new password"
            class="w-full px-4 py-2 bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent"
          />
        </div>

        <div class="mt-6 text-center">
          <button
            :disabled="!isChangePasswordEnabled"
            @click="changePassword"
            class="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-600"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
