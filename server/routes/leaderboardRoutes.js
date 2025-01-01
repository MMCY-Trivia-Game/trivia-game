const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
const {
    updateLeaderboard,
    getLeaderboard,
    getGameResults,
    archiveGame,
    handleReconnect
} = require('../controllers/leaderboardController');

//disabliing the auth for testing purpose of leaderboard
// router.use(authMiddleware);

router.post('/games/:id/leaderboard', updateLeaderboard);
router.get('/games/:id/leaderboard', getLeaderboard);
router.get('/games/:id/results', getGameResults);
router.post('/games/:id/archive', archiveGame);
router.post('/games/:id/reconnect', handleReconnect);

module.exports = router;
