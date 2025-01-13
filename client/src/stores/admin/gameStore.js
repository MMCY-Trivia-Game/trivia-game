import api from '@/plugins/axios'
import { defineStore } from "pinia";

export const useGameStore = defineStore('gameStore', {
    state: () => ({
        games: [],
        isLoading: false,
        error: null
    }),


    actions: {
        async fetchGames(category = null, q = null) {
            this.isLoading = true;
            this.error = null

            try {
                const response = await api.get(`games${q ? `?q=${q}` : `?q=`}${category && category !== 'All' ? `&category=${category}` : ''}`);
                this.games = response.data
            } catch (error) {
                console.log('Error fetching games:', error);
                this.error = error.response?.data?.errors.map((err) => err.msg).join(",") || error.response?.data?.message || 'Failed to fetch games';
            } finally {
                this.isLoading = false;
            }
        },

        async deactivate(id) {
            this.isLoading = true;
            this.error = null

            try {
                const response = await api.put(`games/deactivate/${id}`);
                const index = this.games.findIndex(item => item._id === id);

                if (index !== -1) {
                    this.games[index].is_active = false;
                }
            } catch (error) {
                console.log('Error deactivating game:', error);
                this.error = error.response?.data?.errors.map((err) => err.msg).join(",") || error.response?.data?.message || 'Failed to deactivating games';
            } finally {
                this.isLoading = false;
            }

            if (!this.error) {
                return true
            }
            return this.error
        },

        async activate(id) {
            this.isLoading = true;
            this.error = null

            try {
                const response = await api.put(`games/activate/${id}`);
                const index = this.games.findIndex(item => item._id === id);

                if (index !== -1) {
                    this.games[index].is_active = true;
                }
            } catch (error) {
                console.log('Error activating game:', error);
                this.error = error.response?.data?.errors.map((err) => err.msg).join(",") || error.response?.data?.message || 'Failed on activating games';
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