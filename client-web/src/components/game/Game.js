import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { AuthContext } from '../../contexts/AuthContext';
import Leaderboard from '../dashboard/leaderboard/Leaderboard';
import { useHistory } from 'react-router-dom';

const SOCKET_URL = "http://9e83239690b3.ngrok.io"
const io = require("socket.io-client");

const Game = () => {
    const history = useHistory()

    const { eventList, curEvent } = useContext(AuthContext)
    const [socket, setSocket] = useState(null)
    const [started, setStarted] = useState(false)
    const [ended, setEnded] = useState(false)
    const [gameData, setGameData] = useState(null)

    const [timer, setTimer] = useState(0)

    useEffect(() => {
        if(started) {
            const timerID = setInterval(() => {
                const newTimer = (timer + 1) % 10
                if (newTimer === 9) socket.emit("next-question")
                setTimer(newTimer)
            }, 1000)

            return () => clearInterval(timerID)
        }
    }, [timer, started])

    useEffect(() => {
        setStarted(false)
        setGameData(null)

        let connection = io(SOCKET_URL)
        setSocket(connection)

        connection.emit("new-game", eventList[curEvent]._id)
    }, [curEvent])

    useEffect(() => {
        if(socket) {
            socket.on("new-question", newData => {
                setGameData(newData)
            })

            socket.on("game-end", (leaderboard) => {
                console.log(leaderboard)

                console.log("game over")
                setEnded(true)
                setStarted(false)
            })
        }
    }, [socket])

    const startGame = () => {
        setStarted(true)
        socket.emit("next-question")
    }

    const renderGame = () => {
        if(!gameData) return

        const {question, step, totalSteps} = gameData

        return(
            <>
                <p>{question.prompt}</p>
                {
                    question.answers.map((answer, index) => (
                        <div key={index}>
                            <p>{answer.text}</p>
                        </div>
                    ))
                }
            </>
        )
    }

    return (
        <div>
            <p>{eventList[curEvent].name}</p>
            {started || ended ? null : <Button onClick={startGame}>Start</Button>}
            {started ? renderGame() : null}
            {ended ? <Leaderboard/> : null}
            {ended ? <Button onClick={() => history.push("/app/dashboard")}>Go Back</Button> : null}
        </div>
    );
}
 
export default Game;