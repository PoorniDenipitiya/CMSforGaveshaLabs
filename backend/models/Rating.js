const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResoPost',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);