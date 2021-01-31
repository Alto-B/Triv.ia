const express = require('express') 
const bcrypt = require("bcrypt");
const keys = require("../../config/keys");

const { createToken } = require("../utilities/token")
const { getQuestions } = require("./control")
const { rssParse } = require("../rssdata/rss-generate")
const { scrapeQuestions } = require("../rssdata/scrape")


// Models
const User = require("../models/user.model")
const Event = require("../models/event.model")
const Question = require("../models/question.model")
const Answer = require("../models/answer.model")
const Profile = require('../models/profile.model');

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

router.get('/api/leaderboard', async(req, res) => {
    let result = []

    let profiles = await Profile.find()

    for(let i=0; i<profiles.length; i++) {
        let user = await User.findById(profiles[i].userID)
        result.push({
            userID: user.id,
            username: user.username,
            score: profiles[i].score,
            correct: profiles[i].correct,
            attempted: profiles[i].attempted
        })
    }

    result = result.sort((a, b) => b.score - a.score)
    result = result.slice(0, Math.min(result.length, 5))

    res.status(200).json({
        result
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

router.post('/api/loadRSS', async(req, res) => {
    const { name, image, description, link } = req.body

    let event = new Event({name, adminID: req.userID, image, description})
    await event.save()

    let topics = await rssParse(link)
    let order = 1;

    for(let i=0; i<topics.length; i++) {
        let topic = topics[i].toLowerCase()
        let questions = await scrapeQuestions(topic)

        if(questions.length == 0) continue

        // return res.status(200).json({questions})            

        for(let j=0; j<questions.length; j++) {
            let question = new Question({eventID: event.id, prompt: questions[j].prompt, order: order++})
            await question.save()

            for(let k=0; k<questions[j].answers.length; k++) {
                let answer = new Answer({
                    questionID: question.id,
                    text: questions[j].answers[k].text,
                    correct: questions[j].answers[k].correct,
                })
                await answer.save()
            }
        }
    }

    res.status(200).json({message: "Worked?"})
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
    const { questionID, answers} = req.body
    
    for(let i = 0; i < answers.length; i++){
        let answer = await new Answer({questionID, text: answers[i].text, correct: answers[i].correct})
        answer.save()
    }

    

    res.status(200).json({message: "Created answers"})
})

module.exports = router