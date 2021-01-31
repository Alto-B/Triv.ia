const io = require("socket.io")
const { getQuestions } = require("../api/control");

// Models
const Question = require('../models/question.model')
const Profile = require('../models/profile.model');


const socket_port = 4000;
const server = io.listen(socket_port)

console.log(`Socket listening on port ${socket_port}`);

const EMPTY_GAME = {
    eventID: null,
    questions: [],
    step: -1,
    players: {}
}

let game;

server.on("connection", socket => {
    const { id } = socket.client;
    console.log("Client connected", id)

    // REGISTER --------
    socket.on("new-game", async (eventID) => {
        game = {
            ...EMPTY_GAME,
            eventID,
            questions: await getQuestions()
        }
    })

    socket.on("new-player", playerID => {
        if(game) {
            game.players[id] = playerID            
        } else {
            socket.emit("cannot-join")
        }
    })

    // ADMIN ----------
    // nextQuestion() -- increment step, notify all players, check if game done
    socket.on("next-question", () => {
        game.step += 1

        if(game.step >= game.questions.length) {
            // notify all players + admin
            return server.emit("game-end")
        }

        // notify all players
        socket.broadcast.emit("new-question", ({
            question: game.questions[game.step],
            step: game.step,
            totalSteps: game.questions.length
        }))
    })

    // PLAYER ----------
    // answerQuestion() -- updatePlayer stats
    socket.on("answer-question", async (answerID) => {
        const {players, questions, step} = game

        let userID = players[id]
        let profile = await Profile.findOne({userID})

        profile.attempted += 1

        let correct;
        for(let i=0; i<questions[step].answers.length; i++) {
            // not sure if id is retrieved properly
            if(questions[step].answers._id == answerID) {
                correct = true;
                break;
            }
        }

        let message;
        if(correct) {
            profile.score += questions[step].score
            profile.correct += 1
            message = "correct-answer"
        } else {
            message = "wrong-answer"
        }

        // send message to curretn socket client
        socket.emit(message)
    })

    socket.on("disconnect", () => {
        console.log("Client disonnected")

        if(game && game.players[id]) delete game.players[id]
    })
});