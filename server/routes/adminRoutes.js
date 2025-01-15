const express = require('express');
const { dashboardStat, getAllGames } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, adminOnly, dashboardStat)

router.route('/games')
    .get(protect, adminOnly, getAllGames)


module.exports = router;