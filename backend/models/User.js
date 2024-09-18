
const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: function () {
            return !this.userId; // Require email if userId doesn't exist (Google authentication)
        }
    },
    password: {
        type: String,
        required: function () {
            return !this.userId; // Require password if userId doesn't exist (Google authentication)
        }
    },
    profilePicture: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date,
        default: Date.now
    },
    userType:{
        type: String
    }
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
