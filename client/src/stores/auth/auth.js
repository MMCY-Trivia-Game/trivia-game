import api from '@/plugins/axios'
import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: localStorage.getItem('accessToken') ? jwtDecode(localStorage.getItem('accessToken')) : null,
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        isLoading: false,
        error: null,
    }),
    getters: {
        userRole: (state) => {
            if (state.accessToken) {
                return jwtDecode(state.accessToken)?.user?.role || null;
            }
            return null
        }
    },
    actions: {
        setToken(accessToken, refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        },

        clearToken() {
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },

        isTokenValid() {
            if (!this.accessToken) return false;

            const { exp } = jwtDecode(this.accessToken);
            return exp * 1000 > Date.now();
        },

        logout() {
            this.clearToken();
            this.user = null;
        },


        async login(credentials) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.post('users/login', credentials);
                this.setToken(response.data.accessToken, response.data.refreshToken);
                this.user = jwtDecode(this.accessToken);

            } catch (error) {
                console.error('Login error:', error);
                this.error = error.response?.data?.message || error.response?.data?.message || 'Incorrect password or email!';
            } finally {
                this.isLoading = false;
            }

            if (this.user) {
                return true
            }
            return this.error
        },

        async updateProfileInfo(credentials) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.put(`users/${this.user.id}`, credentials);
                Object.keys(credentials).forEach(key => {
                    if (response.data.hasOwnProperty(key)) {
                        this.user[key] = response.data[key];
                    }
                });
            } catch (error) {
                console.error('profile update error:', error);
                this.error = error.response?.data?.message || error.response?.data?.message || 'Updating profile failed';
            } finally {
                this.isLoading = false;
            }

            if (!this.error) {
                return true
            }
            return this.error
        },

        async updatePassword(credentials) {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.put(`users/update-password/${this.user.id}`, credentials);
                if (response.status === 200) {
                    return true
                } else {
                    this.error = response.data
                }
            } catch (error) {
                console.error('Password update error:', error);
                this.error = error.response?.data?.message || 'Updating password failed';
            } finally {
                this.isLoading = false;
            }

            if (!this.error) {
                return true
            }
            return this.error
        },

        async refreshToken() {
            this.isLoading = true;
            this.error = null;

            try {
                const response = await api.post('users/refresh-token', {
                    refreshToken: this.refreshToken
                });
                this.setToken(response.data.accessToken, this.refreshToken);
                this.user = jwtDecode(this.accessToken);

            } catch (error) {
                console.error('token error error:', error);
                this.error = error.response?.data?.message || error.response?.data?.message || 'token error failed';
            } finally {
                this.isLoading = false;
            }

            if (this.user) {
                return true
            }
            return this.error
        },
    }
})