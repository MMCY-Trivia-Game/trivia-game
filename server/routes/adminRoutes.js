const express = require('express');
const { dashboardStat } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, adminOnly, dashboardStat)


module.exports = router;