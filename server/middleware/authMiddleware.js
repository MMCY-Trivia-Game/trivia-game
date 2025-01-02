const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    next(error);
  }
};

const creatorOnly = (req, res, next) => {
  if (req.user.role !== 'creator') {
    res.status(403);
    throw new Error('Access denied');
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied');
  }
  next();
};

const creatorOrAdminOnly = (req, res, next) => {
  if (req.user.role === 'creator' || req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied');
  }
};

module.exports = {
  protect,
  creatorOnly,
  adminOnly,
  creatorOrAdminOnly,
};
