const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  refreshToken,
  updateUserProfile,
  promoteUserToAdmin,
  demoteUserToCreator,
  suspendUser,
  activateUser,
} = require('../controllers/userControllers');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getAllUsers);

router.get('/:id', protect, adminOnly, getUserById);

router.post('/register', protect, adminOnly, registerUser);

router.post('/login', loginUser);

router.post('/refresh-token', refreshToken);

router.post('/logout', protect, logoutUser);

router.put('/:id', protect, adminOnly, updateUserProfile);

router.put('/admin/:id', protect, adminOnly, promoteUserToAdmin);

router.put('/creator/:id', protect, adminOnly, demoteUserToCreator);

router.put('/suspend/:id', protect, adminOnly, suspendUser);

router.put('/activate/:id', protect, adminOnly, activateUser);

module.exports = router;
