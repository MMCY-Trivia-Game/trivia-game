const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    game_code: {
        type: String,
        required: true,
        unique: true
    },
    questions: [{
        text: {
            type: String,
            required: true
        },
        options: [{
            id: Number,
            text: String
        }],
        correctOptionId: {
            type: Number,
            required: true
        },
        timeLimit: {
            type: Number,
            default: 30 // seconds
        }
    }],
    is_active: {
        type: Boolean,
        default: false
    },
    start_time: {
        type: Date
    },
    end_time: {
        type: Date
    },
    duration: {
        type: Number // in seconds
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    players: [{
        id: String,
        name: String,
        score: {
            type: Number,
            default: 0
        },
        answers: [{
            questionId: Number,
            answerId: Number,
            isCorrect: Boolean,
            timeSpent: Number, // time taken to answer in seconds
            score: Number
        }],
        totalTimeSpent: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

gameSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Game', gameSchema);