const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    game_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: [true, "Game ID is required!"]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required!"]
    },
    score: {
        type: Number,
        required: [true, "Score is required!"],
        min: [0, "Score cannot be negative!"],
        default: 0
    },
    response_time: {
        type: Number,
        required: [true, "Response time is required!"],
        min: [0, "Response time cannot be negative!"]
    },
    rank: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for  querying
leaderboardSchema.index({ game_id: 1, user_id: 1 });
leaderboardSchema.index({ game_id: 1, score: -1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
