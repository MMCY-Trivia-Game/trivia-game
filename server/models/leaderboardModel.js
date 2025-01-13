const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
    {
        game_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game',
            required: [true, 'Game ID is required!'],
        },
        user_name: {
            type: String,
            required: [true, 'User Name is required!'],
        },
        round: {
            type: Number,
            required: [true, 'Round is required!'],
            min: [1, 'Round must be greater than or equal to 1'],
        },
        score: {
            type: Number,
            required: [true, 'Score is required!'],
            min: [0, 'Score cannot be negative!'],
            default: 0,
        },
        rank: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for  querying
leaderboardSchema.index({ game_id: 1, user_id: 1 });
leaderboardSchema.index({ game_id: 1, score: -1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);