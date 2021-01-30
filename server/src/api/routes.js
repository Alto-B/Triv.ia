const express = require('express') 
const bcrypt = require("bcrypt");
const keys = require("../../config/keys");
const { createToken } = require("../utilities/token")

// Models
const User = require("../models/user.model")

const router = express.Router()

// HELPERS
const sendErr = (res, message) => (
    res.status(400).json({message})
)

// AUTH ROUTES
router.post('/login', async (req, res) => {
    let {username, password} = req.body;
    let user = await User.findOne({username});

    if(!user) return sendErr(res, "User does not exist.")

    // Compare encrypted passwords (w/ api key)
    const validated = await bcrypt.compare(
        password + keys.key,
        user.password
    );

    if(!validated) return sendErr(res, "Incorrect password entered.")

    res.status(200).json({
        token: createToken(user.id),
        userID: user.id,
        message: `Succesfully logged in as ${username}.`
    })
})

router.post('/signup', async (req, res) => {
    let {username, password} = req.body;
    let user = await User.findOne({username});

    if(user) return sendErr(res, "User already exists.")

    // Create MongoDB instance
    password = await bcrypt.hash(password + keys.key, 10);
    user = await new User({username, password});
    user.save();

    res.status(200).json({
        token: createToken(user.id),
        userID: user.id,
        message: `Succesfully registered as ${username}.`
    })
})



//
router.get('/c', (req, res) => {
    res.send("hello wolasdasd")
})

module.exports = router