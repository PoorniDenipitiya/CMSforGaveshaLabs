const { ObjectId } = require('mongodb');


const mongoose = require ("mongoose");
const Questions = new mongoose.Schema(
    {
        title:{
            type:String, 
            required : true,

        }, 
        description:{
            type:String,
            required : true,   
        },
        imageUrl:{ 
            type:String,
            required:false,
        },
        viewCount:{
            type:Number, 
            default:0
        },
        date:{
            type:String,
            required:true,
        },
        postedBy: {
            type: ObjectId,
            ref: "User",
            required: false  
        },
    },
    {
        timestamps:true
    }
);
module.exports=mongoose.model('questions',Questions);
