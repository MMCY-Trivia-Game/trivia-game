const express = require('express');
const { dashboardStat } = require('../controllers/adminController')
const { adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(dashboardStat)

module.exports = router;