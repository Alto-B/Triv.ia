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
})

const register = mongoose.model('question', questionSchema);
module.exports = register