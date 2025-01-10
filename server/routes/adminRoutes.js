const express = require('express');
const { registerUser } = requires('../controllers/adminControllers')
const { adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/register').post(registerUser)

module.exports = router;