const { ObjectId } = require('mongodb');
const mongoose = require("mongoose");

const ResoPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    pdf: {
      type: String,
      required: false,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: false 
    },
    categories: {
      type: [String],
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    rejected: {
      type: Boolean,
      default: false,
    },
    ratings: [
      {
        userId: {
          type: ObjectId,
          ref: "User",
          required: false,
        },
        rating: {
          type: Number,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

// Method to calculate the average rating
ResoPostSchema.methods.calculateAverageRating = function () {
  const ratings = this.ratings.map(r => r.rating);
  const sum = ratings.reduce((acc, curr) => acc + curr, 0);
  return ratings.length ? sum / ratings.length : 0;
};

module.exports = mongoose.model("ResoPost", ResoPostSchema);