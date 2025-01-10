import axios from 'axios'
import { useAuthStore } from '@/stores/auth/auth.js';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        if (authStore.accessToken) {
            if (!authStore.isTokenValid()) {
                // Redirect to login or refresh token logic
                authStore.logout();
                throw new axios.Cancel("Token expired, logging out...");
            }
            config.headers.Authorization = `Bearer ${authStore.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (401)
        if (error.response?.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();
        }
        return Promise.reject(error);
    }
);

export default api;