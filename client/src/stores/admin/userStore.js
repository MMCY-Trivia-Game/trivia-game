import api from '@/plugins/axios'
import { defineStore } from "pinia";

export const useUsersStore = defineStore('userStore', {
    state: () => ({
        users: [],
        currentPage: 0,
        limit: 0,
        totalPages: null,
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchUsers(page = 1, q = null) {
            this.isLoading = true;
            this.error = null;


            try {
                const response = await api.get(`users?page=${page}${q ? `&q=${q}` : ''}`);
                this.users = response.data.docs;
                this.totalPages = response.data.totalPages;
                this.currentPage = response.data.page
                this.limit = response.data.limit
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

        async updateUser(user) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.put(`users/${user._id}`, user);
                const index = this.users.findIndex(item => item._id === user._id);
                console.log(response.data, 'updated user')
                if (index !== -1) {
                    this.users[index] = response.data;
                }
            } catch (error) {
                console.log('Error updating user:', error);
                this.error = error.response?.data?.errors.map((err) => err.msg).join(",") || error.response?.data?.message || 'Failed to update user';
            } finally {
                this.isLoading = false;
            }

            if (!this.error) {
                return true
            }
            return this.error

        }
    }
})