const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const gameSchema = new mongoose.Schema(
  {
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required!'],
    },
    title: {
      type: String,
      required: [true, 'Title is required!'],
      minlength: [2, 'Title must be at least 2 characters long!'],
      maxlength: [50, 'Title cannot exceed 50 characters!'],
    },
    category: {
      type: String,
      required: [true, 'Category is required!'],
      enum: [
        'General Knowledge',
        'Technology',
        'History',
        'Geography',
        'Entertainment',
        'Sports',
        'Culture',
        'Food and Drink',
        'Mythology',
        'Fun',
        'Others',
      ],
    },
    maxUsers: {
      type: Number,
      default: 2,
    },
    game_code: {
      type: String,
      required: [true, 'Game code is required!'],
    },
    question_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Question',
      default: [],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

gameSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Game', gameSchema);
