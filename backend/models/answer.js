const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    answer: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
    postId: {
      type: String,
      required: false,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Adjust as per your application logic
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      default: null
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", AnswerSchema);
