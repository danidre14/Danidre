const mongoose = require('mongoose');

const highscoreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true,
        default: 1
    }, 
    key: {
        type: String
    },
    scores: [{
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: {
            type: Number
        },
        obtainedAt: {
            type: Date
        }
    }]
});

module.exports = mongoose.model('Highscore', highscoreSchema);