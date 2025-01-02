const express = require('express');
const {
  createGame,
  getAllGames,
  getGameById,
  getGamesByCreatorId,
  updateGame,
  activateGame,
  deactivateGame,
  addQuestion,
  clearQuestions,
} = require('../controllers/gameControllers');
const {
  protect,
  creatorOnly,
  adminOnly,
  creatorOrAdminOnly,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getAllGames);

router.get('/:id', protect, creatorOrAdminOnly, getGameById);

router.get('/creator/:id', protect, creatorOrAdminOnly, getGamesByCreatorId);

router.post('/', protect, creatorOnly, createGame);

router.put('/:id', protect, creatorOnly, updateGame);

router.put('/deactivate/:id', protect, creatorOrAdminOnly, deactivateGame);

router.put('/activate/:id', protect, creatorOrAdminOnly, activateGame);

router.put('/questions/add/:id', protect, creatorOnly, addQuestion);

router.put('/questions/clear/:id', protect, creatorOnly, clearQuestions);

module.exports = router;
