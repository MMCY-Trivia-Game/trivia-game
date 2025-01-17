const express = require('express');
const router = express.Router();
const { 
  createGame,
  getActiveGames,
  getGameById,
  activateGame,
  endGame
} = require('../controllers/gameController');

// Game routes
router.post('/create', createGame);
router.get('/active', getActiveGames);
router.get('/:id', getGameById);
router.put('/:id/activate', activateGame);
router.put('/:id/end', endGame);

module.exports = router;
