import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Box, Button, CircularProgress, Grid, Toolbar, Typography } from '@material-ui/core';
import { AuthContext } from '../../contexts/AuthContext';
import Leaderboard from '../dashboard/leaderboard/Leaderboard';
import { useHistory } from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles'

const SOCKET_URL = "http://ab408af5a2da.ngrok.io"
const io = require("socket.io-client");

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    spinner: {
        marginTop: "10%"
    },
    button: {
        marginTop: "5%"
    }
  }));

const Game = () => {
    const history = useHistory()
    const classes = useStyles();

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

        return renderQuestion(question)
    }

    const colors = ["#9B51E0", "#2F80ED", "#27AE60", "#EB5757"]

    const renderQuestion = (question) => (
        <>
            <Typography variant="h3"component="h3" style={{marginTop: 30}}>
                {question.prompt}
            </Typography>
            <Grid container spacing={5} style={{marginTop: '10%'}}>
            {
                question.answers.map((answer, index) => (
                    <Grid item xs={6} key={index} style={{marginBottom: 10}}>
                        <Box bgcolor={"#c9c8c5"}>
                            <Typography variant="h2" component="h5" style={{padding: 100, color:colors[index]}} borderRadius={16}>
                                {answer.text}
                            </Typography>

                        </Box>
                    </Grid>
                ))
            }
            </Grid>
        </>
    )

    return (
        <div>
            {/* <p>{eventList[curEvent].name}</p> */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        {eventList[curEvent].name}
                    </Typography>

                </Toolbar>
            </AppBar>
            {started || ended ? null: 
                <div>
                    <Typography style={{marginTop: 10}} variant="h1" component="h3">
                        Waiting for Players
                    </Typography>
                    <CircularProgress color='secondary' size={90} className={classes.spinner}></CircularProgress>
                </div>}
            
            
            {started || ended ? null : <Button variant="contained" color="primary" size="large" onClick={startGame} className={classes.button}>Start</Button>}
            
            {started ? renderGame() : null}
            {ended ? <Leaderboard/> : null}
            {ended ? <Button onClick={() => history.push("/app/dashboard")}>Go Back</Button> : null}
        </div>
    );
}
 
export default Game;