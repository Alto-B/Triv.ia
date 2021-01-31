import React, { useEffect, useState } from 'react';
import { AsyncStorage } from "react-native";
import axios from 'axios'

const { SOCKET_URL, DEV_URL } = require("../config")
const io = require("socket.io-client");

export const SocketContext = React.createContext({
    socket: null,
    user: null
})

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const [user, setUser] = useState(null)
 
    const [gameData, setGameData] = useState(null)
    const [ended, setEnded] = useState(false)
    const [connected, setConnected] = useState(false)

    const [report, setReport] = useState(null)

    const localAuth = async() => {
        let userID = await AsyncStorage.getItem("user")
        setUser(userID)
    }

    const connectToSocket = () => {
        if(user) {
            //setReport(null)
            let connection = io(SOCKET_URL)
            setSocket(connection)

            connection.emit("new-player", user)
            console.log("registered with socket")
        }
    }

    useEffect(() => {
        localAuth()
    }, [])

    useEffect(() => {
        return () => {
            socket?.disconnect();
        }
    }, [])

    useEffect(() => {
        if(socket) {
            socket.on("cannot-join", () => {
                console.log("could not join")
            })

            socket.on("new-question", newData => {
                setGameData(newData)
            })

            socket.on("game-end", (leaderboard) => {
                console.log(leaderboard)
                setEnded(true)
                setGameData(null)
                setReport({
                    leaderboard
                })
            })
        }
    }, [socket])    

    return(
        <SocketContext.Provider
            value={{
                socket,
                user,
                gameData,
                ended,
                setEnded,
                connectToSocket,
                report,

                sendAnswer: (answerID) => {
                    socket.emit("answer-question", answerID)
                },

                authenticate: async (username, password, path="login") => {
                    try {
                        const result = await axios.post(
                            DEV_URL + "/api/" + path,
                            {username, password}
                        )

                        setUser(result.data.userID)
                        await AsyncStorage.setItem('user', result.data.userID)
                        return true
                    } catch(error) {
                        console.log(error.response.data.message)
                        return false
                    }
                }
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}