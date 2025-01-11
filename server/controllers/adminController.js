const { check, validationResult } = require("express-validator");
const User = require('../models/userModel')
const asyncHandler = require("express-async-handler"); x




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

    asyncHandler(async (req, res) => {
        // Get validation result from request
        const errors = validationResult(req);

        // If there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract validated data
        const { first_name, last_name, email, role, password } = req.body;

        //check if the user is available
        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
            res.status(400);
            throw new Error("User already registered!");
        }

        //save user
        const user = await User.create({ first_name, last_name, email, role, password });

        if (user) {
            const userObj = user.toObject();
            delete userObj.password
            //return user info without passwords
            res.status(201).json(userObj);
        } else {
            res.status(400);
            throw new Error("user data is not valid!");
        }
    })
]


