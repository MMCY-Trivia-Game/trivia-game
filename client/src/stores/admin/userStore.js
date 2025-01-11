import api from '@/plugins/axios'
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useUsersStore = defineStore('userStore', {
    state: () => ({
        users: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchUsers() {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.get('users');
                this.users = response.data;
            } catch (error) {
                console.log('Error fetching users:', error);
                this.error = error.response?.data?.errors.map((err) => err.msg).join(",") || error.response?.data?.message || 'Failed to fetch categories';
            } finally {
                this.isLoading = false;
            }
        },

        async addUser(user) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.post('users/register', user);
                this.users.push(response.data.userObj);
            } catch (error) {
                console.log('Error adding user:', error);
                this.error = error.response?.data?.errors.map((err) => err.msg).join(",") || 'Failed to add user';
            } finally {
                this.isLoading = false;
            }

            if (!this.error) {
                return true
            }
            return this.error
        },
    }
})