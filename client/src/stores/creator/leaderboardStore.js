import { LEADERBOARD_URL } from '@/Constant';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useGamesStore } from '../creator/gamesStore';

const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ZkMDY4NTBhOGE3YzQ5YmY1YzRhZCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNjc1NDM0MiwiZXhwIjoxNzM4MDUwMzQyfQ.u8_tWA-KEgOdSIeWz5cavw-5F3VgXP0E992kRq8-bg8';

export const useLeaderboardStore = defineStore('Leaderboard', () => {
  const gamesStore = useGamesStore();
  const players = ref([]);
  const roundsList = ref([]);
  const selectedRoundIndex = ref(0);
  const allLeaderboard = ref({});
  const leaderboard = ref([]);
  const formattedPlayers = ref([]);

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

  async function createLeaderboard(lead = formattedPlayers.value) {
    try {
      const game_id = gamesStore.selectedGame._id;
      await getLeaderboards(game_id);
      const round = roundsList.value[roundsList.length - 1] + 1;

      // console.log(selectedGame.value);
      // console.log(data);

      const leaderboard = await Promise.all(
        lead.map(async (l) => {
          const il = await createIndividualRecord({
            game_id,
            user_name: l.player.name,
            round,
            score: l.score,
            rank: l.rank,
          });
          // await addQuestion(newGame._id, q._id);
          console.log(il);
        })
      );

      router.push(`/creator/game/${newGame._id}`);

      // console.log(data.game);
    } catch (err) {
      // error.value = 'Failed to create a game';
      console.log('Failed To Create the game', err);
    } finally {
      // loading.value = false;
    }
  }

  async function createIndividualRecord(lead) {
    try {
      // loading.value = true;
      const response = await fetch(`${LEADERBOARD_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          game_id: lead.game_id,
          user_name: lead.user_name,
          round: lead.round,
          score: lead.score,
          rank: lead.rank,
        }),
      });

      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      // error.value = err;
      console.log('Failed to Create a question', err);
    } finally {
      // loading.value = false;
    }
  }

  const formatAndRankPlayers = (players) => {
    console.log(players);
    const formattedPlyrs = players.map((p) => ({
      user_name: p.player.name,
      score: p.score,
    }));

    formattedPlyrs.sort((a, b) => b.score - a.score);

    formattedPlyrs.forEach((player, index) => {
      player.rank = index + 1;
    });

    formattedPlayers.value = formattedPlyrs;
    console.log(formattedPlayers.value);
  };

  return {
    players,
    roundsList,
    selectedRoundIndex,
    allLeaderboard,
    leaderboard,
    formattedPlayers,
    getLeaderboards,
    setSelectedRoundIndex,
    getLeaderboard,
    createLeaderboard,
    formatAndRankPlayers,
  };
});
