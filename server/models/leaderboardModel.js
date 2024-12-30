const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required!"],
        minlength: [2, "Name must be at least 2 characters long!"],
        maxlength: [50, "Name cannot exceed 50 characters!"]
    },
    game_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: [true, "Game ID is required!"]
    },
    score: {
        type: Number,
        required: [true, "Score is required!"],
        min: [0, "Score cannot be negative!"],
        default: 0 
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
