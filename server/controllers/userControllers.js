const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const transporter = require('../config/mailer');
const { check, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/jwtUtils');
const crypto = require('crypto');


/**
 * @des Register user
 * @route POST /api/user/register
 * @access Private
 */

exports.registerUser = [
  check("first_name")
    .notEmpty()
    .withMessage("firstName is required")
    .isLength({ min: 3 })
    .withMessage("firstName must be at least 3 characters long"),
  check("last_name")
    .notEmpty()
    .withMessage("last_name is required")
    .isLength({ min: 3 })
    .withMessage("last_name must be at least 3 characters long"),
  check("email").isEmail().withMessage("Please provide a valid email address"),
  check("role").notEmpty().withMessage("Please provide a role of user"),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/) // Ensure it contains at least one digit
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/) // Ensure it contains at least one uppercase letter
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/) // Ensure it contains at least one lowercase letter
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[\W_]/) // Ensure it contains at least one special character
    .withMessage('Password must contain at least one special character'),
  check('is_active')
    .isBoolean(),

  asyncHandler(async (req, res) => {
    // Get validation result from request
    const errors = validationResult(req);

    // If there are validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract validated data
    const { first_name, last_name, email, role, password, is_active } = req.body;

    //check if the user is available
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }

    //save user
    const user = await User.create({ first_name, last_name, email, role, password, is_active });

    if (user) {
      const userObj = user.toObject();
      delete userObj.password
      //return user info without passwords
      res.status(201).json({
        message: 'Registration successful!',
        userObj
      });
    } else {
      res.status(400);
      throw new Error("user data is not valid!");
    }
  })
]


exports.loginUser = [
  check("email").isEmail().withMessage("Please provide a valid email address"),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/) // Ensure it contains at least one digit
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/) // Ensure it contains at least one uppercase letter
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/) // Ensure it contains at least one lowercase letter
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[\W_]/) // Ensure it contains at least one special character
    .withMessage('Password must contain at least one special character'),

  asyncHandler(async (req, res) => {
    // Get validation result from request
    const errors = validationResult(req);

    // If there are validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password!'
      });
    }


    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: 'Login successful!',
      user,
      accessToken,
      refreshToken,
    })
  })
]


exports.logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Logout successful!' });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const options = {
      page: req.query.page || 1,
      limit: 10,
      collation: {
        locale: 'en',
      },
    };

    let searchQuery = {};

    if (q) {

      searchQuery = {
        $or: [
          { first_name: { $regex: q, $options: 'i' } },
          { last_name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { role: { $regex: q, $options: 'i' } },
        ],
      };
    }

    const users = await User.paginate(searchQuery, options);

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
    const refreshToken = req.body.refresh_token || req.query.refresh_token || req.headers['x-refresh-token'];

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required!' });
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

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (user) {
      user.first_name = req.body.first_name || user.first_name;
      user.last_name = req.body.last_name || user.last_name;
      user.email = req.body.email || user.email;

      if (req.body.password || req.password) {
        user.password = req.body.password || req.password;
      }

      if (req.body.role || req.role) {
        user.role = req.body.role || req.role;
      }

      if (req.body.is_active || req.is_active) {
        user.is_active = req.body.is_active || req.is_active;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
        is_active: updatedUser.is_active
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


exports.updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.sendResetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    const token = crypto.randomBytes(20).toString('hex');
    user.token = token
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1); // Token expires in 1 hour

    user.tokenExpiration = tokenExpiration;
    await user.save()

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`,
    };




    try {
      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(error)
    }

    res.status(200).json({ status: 'success', message: 'Email sent successfully' });

  } else {
    res.status(200).json({ status: 'success', message: 'Email sent successfully' });
  }
})

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({ token });

  if (user) {
    // Check if the token has expired
    const currentDate = new Date();
    if (user.tokenExpiration < currentDate) {
      return res.status(400).send('Token has expired');
    }

    // Update the user's password and clear the token
    user.password = newPassword;
    user.token = null;
    user.tokenExpiration = null;
    await user.save();

    res.status(200).json({ message: 'Password successfully updated' });
  } else {
    return res.status(404).json({ message: 'Invalid Token' });
  }

}
);

exports.checkTokenValidity = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: 'Invalid Token' });
    }

    const currentDate = new Date();
    if (user.tokenExpiration < currentDate) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    res.status(200).json({ message: 'Token is valid' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
})