const Question = require("../models/question.model")
const Answer = require("../models/answer.model")

module.exports = {
    getQuestions: async (req, res) => {  
        const { eventID } = req.body 
        let questions = await Question.find({eventID}).sort("order")
        let results = []
    
        for(let i=0; i<questions.length; i++) {
            let questionID = questions[i].id
            let answers = await Answer.find({questionID})
            
            results.push({
                ...questions[i]._doc,
                answers
            })
        }
    
        res.status(200).json({results})
    }
}