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
                this.error = error.response?.data?.message || error.response?.data?.message || 'Login failed';
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