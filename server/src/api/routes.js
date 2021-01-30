const express = require('express') 
// const bcrypt = require("bcrypt");
const keys = require("../../config/keys");
// const token = require("../../utilities/token");

// Models
const User = require("../models/user.model")

const router = express.Router()

// AUTH ROUTES
// router.post('/login', (req, res) => {
//     let {email, password} = req.body;
//     let user = await User.findOne({email});

//     if(!user) {
//         res.send
//         throw Error("User with that email does not exist.");
//     }

//     // Compare encrypted passwords (w/ api key)
//     const validated = await bcrypt.compare(
//         password + keys.key,
//         user.password
//     );

//     if(!validated) {
//         throw Error("Incorrect password entered.");
//     }

//     return {
//         token: token.createToken(user.id),
//         userID: user.id,
//         message: `Succesfully logged in as ${user.email}.`
//     }
// })

router.post('/signup', (req, res) => {
    res.send("hello wolasdasd")
})


//
router.get('/c', (req, res) => {
    res.send("hello wolasdasd")
})

module.exports = router