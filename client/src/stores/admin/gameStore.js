import api from '@/plugins/axios'
import { defineStore } from "pinia";

export const useGameStore = defineStore('gameStore', {
    state: () => ({
        games: [],
        isLoading: false,
        error: null
    }),


    actions: {
        async fetchGames(category = null) {
            console.log('store', category)
            this.isLoading = true;
            this.error = null

            try {
                const response = await api.get(`games${category && category !== 'All' ? `?category=${category}` : ''}`);
                this.games = response.data
            } catch (error) {
                console.log('Error fetching games:', error);
                this.error = error.response?.data?.errors.map((err) => err.msg).join(",") || error.response?.data?.message || 'Failed to fetch games';
            } finally {
                this.isLoading = false;
            }
        }
    }
})