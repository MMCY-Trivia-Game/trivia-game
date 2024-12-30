const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required!']
    },
    title: {
        type: String,
        required: [true, "Title is required!"],
        minlength: [2, "Title must be at least 2 characters long!"],
        maxlength: [50, "Title cannot exceed 50 characters!"]
    },
    maxUsers: {
        type: Number,
        default: 2
    },
    game_code: {
        type: Number,
        required: [true, "Game code is required!"]
    },
    question_ids: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Question', 
        default: [] 
    },
    is_active: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);