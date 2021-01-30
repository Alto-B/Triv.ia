const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    attempted: {
        type: Number,
        default: 0
    },
    correct: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    }
})

const register = mongoose.model('profile', profileSchema);
module.exports = register