//imports Mongoose library
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');

//define the structure of documents (key, value pairs) in MongoDB database
const projectpostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    project_name: {
      type: String,
      required: true,
    },
    components: {
      type: String,
      required: true,
    },
    objectives: {
      type: String,
      required: true,
    },
    intro: {
      type: String,
      required: true,
    },
    project_photo: {
      type: String,
      required: false,
    },
    project_video:{
      type: String,
      required: false,
      //unique: true
  },
    explanation: {
      type: String,
      required: true,
    },
    circuit_diagram: {
      type: String,
      required: false,
    },
    pcb_design: {
      type: String,
      required: false,
    },
    git_link: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: false 
    },
   /* time:{
      type:Date,
      default: Date.now,
    },*/
    approved: {
      type: Boolean,
      default: false,
    },
    rejected: {
      type: Boolean,
      default: false,
    },
    likes: { type: Number, default: 0 }, // Total likes for the project
  },
  { timestamps: true } // additional 2 fields fore createdAt and updatedAt
); 

//Create Mongoose model as Projectpost based on the projectpostSchema
module.exports = mongoose.model("Projectpost", projectpostSchema);