const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
})

const register = mongoose.model('profile', profileSchema);
module.exports = register