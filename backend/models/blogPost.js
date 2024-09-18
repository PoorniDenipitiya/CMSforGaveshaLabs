const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const Bookmark = require('./Bookmark.js');

// Function to validate YouTube URLs
const isValidYoutubeUrl = (url) => {
  if (!url) {
    return true; // Allow null or empty string values
  }
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return regex.test(url);
};

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  videoURL: {
    type: String,
    required: false,
    validate: {
      validator: isValidYoutubeUrl,
      message: (props) => `${props.value} is not a valid YouTube URL!`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: ObjectId, ref: 'User' }],
  postedBy: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: false,
  }
});

blogPostSchema.pre('findOneAndDelete', async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
      await Bookmark.deleteMany({ blogPost: doc._id });
    }
    next();
  } catch (error) {
    console.error('Error deleting bookmarks:', error);
    next(error);
  }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;