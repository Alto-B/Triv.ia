const express = require('express') 
const bcrypt = require("bcrypt");
const keys = require("../../config/keys");
const { createToken } = require("../utilities/token")
const { getQuestions } = require("./control")

// Models
const User = require("../models/user.model")
const Event = require("../models/event.model")
const Question = require("../models/question.model")
const Answer = require("../models/answer.model")

const router = express.Router()

// HELPERS -----------------
const sendErr = (res, message) => (
    res.status(400).json({message})
)

// AUTH ROUTES -----------------
router.post('/api/login', async (req, res) => {
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

router.post('/api/signup', async (req, res) => {
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


// ADMIN ROUTES ----------------
// Events
router.get('/api/event', async (req, res) => {   
    let events = await Event.find({adminID: req.userID})
    res.status(200).json({events})
})


router.post('/api/event', async (req, res) => {
    const { name, image, description } = req.body

    let event = await new Event({name, adminID: req.userID, image, description})
    event.save()

    res.status(200).json({event})
})

// Question
router.get('/api/question', async(req, res) => {
    let results = await getQuestions(req.body.eventID)
    res.status(200).json({results})
})

router.post('/api/question', async (req, res) => {  
    const { eventID, prompt } = req.body 
    
    let questions = await Question.find({eventID})
    let order = questions.length + 1;

    let question = await new Question({eventID, prompt, order})
    question.save()

    res.status(200).json({question})
})

// Answer
router.post('/api/answer', async (req, res) => {  
    const { questionID, text, correct } = req.body 

    let answer = await new Answer({questionID, text, correct})
    answer.save()

    res.status(200).json({answer})
})

module.exports = router