const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: [true, "First name is required!"],
        minlength: [2, "First name must be at least 2 characters long!"],
        maxlength: [50, "First name cannot exceed 50 characters!"]
    },
    last_name: {
        type: String,
        trim: true,
        required: [true, "Last name is required!"],
        minlength: [2, "Last name must be at least 2 characters long!"],
        maxlength: [50, "Last name cannot exceed 50 characters!"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required!'],
        unique: [true, 'Email already taken!'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address!']
    },
    role: {
        type: String,
        enum: ['admin', 'creator'],
        default: 'creator'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
}, { timestamps: true });

// Middleware to hash passwords
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Index email
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
