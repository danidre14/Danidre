const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: Array,
        required: true,
        default: ['user']
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    bio: {
        type: String,
        default: "New user"
    }
    /*
    ,
    userImage: {
        type: Buffer,
        required: true
    },
    userImageType: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    }*/
});

module.exports = mongoose.model('User', userSchema);