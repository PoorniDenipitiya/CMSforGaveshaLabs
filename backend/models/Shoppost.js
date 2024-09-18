const { ObjectId } = require('mongodb');

const mongoose = require("mongoose");

const ShoppostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    }, 
    price: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
    },
    createdAt:{ 
      type: Date,
      default: Date.now,
      index: { expires: '7d' },
    },
    userEmail:{
      type:String,
      required:true,
    } ,
    
    postedBy: {
      type: ObjectId,
      ref: "User",
      required: false  
  },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Shoppost", ShoppostSchema);
