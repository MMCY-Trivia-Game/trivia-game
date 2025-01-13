import api from '@/plugins/axios'
import { defineStore } from "pinia";


export const useDashboardStore = defineStore('dashboardStore', {
    state: () => ({
        stats: [],
        isLoading: false,
        error: null
    }),

    actions: {
        async fetchStats() {
            this.isLoading = true;
            this.error = null

            try {
                const response = await api.get('dashboard');
                this.stats = response.data
            } catch (error) {
                console.log('Error fetching stats:', error);
                this.error = error.response?.data?.errors.map((err) => err.msg).join(",") || error.response?.data?.message || 'Failed to fetch stats';
            } finally {
                this.isLoading = false;
            }
        }
    }
})