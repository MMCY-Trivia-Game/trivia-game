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
            config.headers.Authorization = `Bearer ${authStore.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {

        const originalRequest = error.config;

        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const authStore = useAuthStore();
                const response = await authStore.refreshToken()
                if (response) {
                    originalRequest.headers['Authorization'] = `Bearer ${authStore.accessToken}`;

                    return axiosInstance(originalRequest);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;