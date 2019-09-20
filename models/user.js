const mongoose = require('mongoose');
const Role = require('./role');

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
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Role'
    }],
    // roles: {
    //     type: [String],
    //     required: true,
    //     default: ['user']
    // },
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
    lastSeen: {
        type: Date
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
    },
    secret: {
        polyTT: [String],
        surveyMaker: {
            type: Object,
            default: {"Survey Template": "1&scn&Enter your age:&scn&16-17&cln&0&cma&18-19&cln&0&cma&20+&cln&0&fsp&1&scn&Enter gender:&scn&Male&cln&0&cma&Female&cln&0&cma&Other&cln&0&fsp&1&scn&Do you like fruits?&scn&Yes&cln&0&cma&No&cln&0&fsp&1&scn&Which fruit do you prefer the most?&scn&Apple&cln&0&cma&Banana&cln&0&cma&Orange&cln&0&cma&Grape&cln&0&cma&Other&cln&0&fsp&0&scn&Give a reason for your answer:&fsp&0&scn&Give one suggestion of what would make you eat more fruits:"}
        }
    },
    profileImage: {
        type: Buffer
    },
    profileImageType: {
        type: String
    }
    /*
    ,
    DOB: {
        type: Date,
        required: true
    }*/
});

userSchema.virtual('profileImagePath').get(function() {
    if (this.profileImage != null && this.profileImageType != null) {
        return `data:${this.profileImageType};charset=utf-8;base64,${this.profileImage.toString('base64')}`
    }
})

module.exports = mongoose.model('User', userSchema);