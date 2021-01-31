const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    prompt: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    eventID: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 10
    }
})

const register = mongoose.model('question', questionSchema);
module.exports = register