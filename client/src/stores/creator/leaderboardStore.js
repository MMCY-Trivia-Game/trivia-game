import { LEADERBOARD_URL } from '@/Constant';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMDY4NTBhOGE3YzQ5YmY1YzRhZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNjc1NDM0MiwiZXhwIjoxNzM4MDUwMzQyfQ.u8_tWA-KEgOdSIeWz5cavw-5F3VgXP0E992kRq8-bg8';

export const useLeaderboardStore = defineStore('Leaderboard', () => {
  const players = ref([]);
  const roundsList = ref([]);
  const selectedRoundIndex = ref(0);
  const allLeaderboard = ref({});
  const leaderboard = ref([]);

  async function getLeaderboards(gameId) {
    try {
      const response = await fetch(`${LEADERBOARD_URL}/${gameId}/leaderboard`);
      const data = await response.json();

      leaderboard.value = data.leaderboard;

      const groupedByRound = leaderboard.value.reduce((acc, entry) => {
        if (!acc[entry.round]) {
          acc[entry.round] = [];
        }
        acc[entry.round].push(entry);
        return acc;
      }, {});

      const roundIdentifiers = Object.keys(groupedByRound).map((round) =>
        parseInt(round, 10)
      );

      const rounds = roundIdentifiers.map((round) => ({
        round,
        players: groupedByRound[round],
      }));

      allLeaderboard.value = {
        gameId,
        rounds,
        totalRounds: roundIdentifiers.length,
        roundIdentifiers,
      };

      roundsList.value = roundIdentifiers;
      console.log(allLeaderboard.value);
    } catch (error) {
      console.log('Failed to fetch rounds');
    }
  }

  function setSelectedRoundIndex(roundIndex) {
    selectedRoundIndex.value = roundIndex;
  }

  function getLeaderboard() {
    leaderboard.value =
      allLeaderboard.value.rounds[selectedRoundIndex.value].players;
    console.log(leaderboard.value);
  }

  return {
    players,
    roundsList,
    selectedRoundIndex,
    allLeaderboard,
    leaderboard,
    getLeaderboards,
    setSelectedRoundIndex,
    getLeaderboard,
  };
});
