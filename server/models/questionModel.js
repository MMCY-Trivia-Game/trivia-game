const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Text is required!"],
        minlength: [2, "Text must be at least 2 characters long!"],
        maxlength: [400, "Text cannot exceed 400 characters!"]
    },
    timeLimit: {
        type: Number,
        required: [true, "Time limit is required!"],
        min: [1, "Time limit must be at least 1 second."]
    },
    option: {
        type: [String], // Array of strings for options
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: "There must be at least one option!"
        }
    },
    correctOptionId: {
        type: mongoose.Types.ObjectId,
        default: null,
    }
});

module.exports = mongoose.model('Question', questionSchema)
