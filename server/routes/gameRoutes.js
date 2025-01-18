const express = require('express');
const {
  createGame,
  getAllGames,
  getGameById,
  getMyGames,
  getGamesByCategory,
  activateGame,
  deactivateGame,
  addQuestion,
  clearQuestions,
} = require('../controllers/gameControllers');

const { endGame } = require('../controllers/gameController');
const {
  protect,
  creatorOnly,
  adminOnly,
  creatorOrAdminOnly,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getAllGames);

router.get('/my', protect, creatorOnly, getMyGames);

router.get('/:id', protect, creatorOrAdminOnly, getGameById);

router.get(
  '/category/:category',
  protect,
  creatorOrAdminOnly,
  getGamesByCategory
);

router.get('/creator/:id', protect, creatorOrAdminOnly, getGamesByCreatorId);

router.post('/', protect, creatorOnly, createGame);

router.put('/:id', protect, creatorOnly, updateGame);

router.put('/deactivate/:id', protect, creatorOrAdminOnly, deactivateGame);

router.put('/activate/:id', protect, creatorOrAdminOnly, activateGame);

router.put('/questions/add/:id', protect, creatorOnly, addQuestion);

router.put('/questions/clear/:id', protect, creatorOnly, clearQuestions);

// Game routes
router.post('/create', createGame);
router.get('/active', getActiveGames);
router.get('/:id', getGameById);
router.put('/:id/activate', activateGame);
router.put('/:id/end', endGame);

module.exports = router;
