/**
 * @module jwtUtils
 * @description Utilities for generating JWT access and refresh tokens.
 */

const jwt = require('jsonwebtoken');

/**
 * @function generateAccessToken
 * @description Generates a short-lived access token.
 * @param {Object} user - The user object containing the user ID and role.
 * @returns {string} JWT access token.
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_active: user.is_active,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15d',
    }
  );
};

/**
 * @function generateRefreshToken
 * @description Generates a long-lived refresh token.
 * @param {Object} user - The user object containing the user ID.
 * @returns {string} JWT refresh token.
 */
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
