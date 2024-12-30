const mongoose = require('mongoose')


const gameSchema = mongoose.Schema({
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    title: {
        type: String,
        required: [true, "Title is required!"],
        minlength: [2, "title must be at least 2 characters long!"],
        maxlength: [50, "title cannot exceed 50 characters!"]
    },
    maxUsers: {
        type: Number,
        default: 2
    },
    game_code: {
        type: Number,
        required: [true, "Game code is required!"]
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('game', gameSchema)