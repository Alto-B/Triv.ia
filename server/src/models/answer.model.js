const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    questionID: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    correct: {
        type: Boolean,
        required: true
    },
})

const register = mongoose.model('answer', answerSchema);
module.exports = register