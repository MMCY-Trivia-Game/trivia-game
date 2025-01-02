const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/jwtUtils');

exports.registerUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      password,
    });

    res.status(201).json({ message: 'User registered successfully!', user });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401);
      throw new Error('Invalid email or password!');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: 'Login successful!',
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Logout successful!' });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401);
      return next(new Error('Refresh token is required!'));
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        res.status(403);
        return next(new Error('Invalid or expired refresh token!'));
      }
      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user) {
      user.first_name = req.body.first_name || user.first_name;
      user.last_name = req.body.last_name || user.last_name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

exports.promoteUserToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const role = { role: 'admin' };
    const user = await User.findByIdAndUpdate(id, role, { new: true });
    if (!user) {
      res.status(404);
      throw new Error('User not found!');
    }
    res.json({ message: 'User promoted to admin successfully!', user });
  } catch (error) {
    next(error);
  }
};

exports.demoteUserToCreator = async (req, res) => {
  try {
    const { id } = req.params;
    const role = { role: 'creator' };
    const user = await User.findByIdAndUpdate(id, role, { new: true });
    if (!user) {
      res.status(404);
      throw new Error('User not found!');
    }
    res.json({ message: 'User demoted to creator successfully!', user });
  } catch (error) {
    next(error);
  }
};

exports.suspendUser = async (req, res, next) => {
  const { id } = req.params;
  const suspend = { is_active: false };
  try {
    const user = await User.findByIdAndUpdate(id, suspend, { new: true });
    if (!user) {
      res.status(404);
      throw new Error('User not found!');
    }
    res.json({ message: 'User suspended successfully!', user });
  } catch (error) {
    next(error);
  }
};

exports.activateUser = async (req, res, next) => {
  const { id } = req.params;
  const suspend = { is_active: true };
  try {
    const user = await User.findByIdAndUpdate(id, suspend, { new: true });
    if (!user) {
      res.status(404);
      throw new Error('User not found!');
    }
    res.json({ message: 'User activated successfully!', user });
  } catch (error) {
    next(error);
  }
};

// export {
//   registerUser,
//   loginUser,
//   logoutUser,
//   getAllUsers,
//   getUserById,
//   refreshToken,
//   updateUserProfile,
//   promoteUserToAdmin,
//   demoteUserToCreator,
//   suspendUser,
//   activateUser,
// };
