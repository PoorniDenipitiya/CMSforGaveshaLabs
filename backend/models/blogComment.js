const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
const BlogCommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
        ref: "User", 
        required: true , // Adjust as per your application logic
    },
    postId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogComment', // Reference to itself for nested comments
      default: null,
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogComment', // Reference to itself for nested comments
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlogComment", BlogCommentSchema);