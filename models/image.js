const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    filename: {
        type: String
    },
    contentType: {
        type: String
    },
    data: {
        type: Buffer
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Image', imageSchema);
