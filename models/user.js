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
        default: true
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
    },
    signedUpAt: {
        type: Date,
        required: true,
        default: Date.now
    }*/
});

module.exports = mongoose.model('User', userSchema);