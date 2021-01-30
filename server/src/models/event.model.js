const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    adminID: {
        type: String,
        required: true
    },
})

const register = mongoose.model('event', eventSchema);
module.exports = register