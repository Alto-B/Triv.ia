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

    const [question, setQuestion] = useState({
        step: 0,
        totalSteps: 10,
        prompt: "Who won the NBA Championship in 2019/2020 season?",
        answers: [
            {
                '_id': "1234",
                text: "Raptops"
            },
            {
                '_id': "1234",
                text: "Nuggets"
            },
            {
                '_id': "1234",
                text: "Thunder"
            },
            {
                '_id': "1234",
                text: "Barcelona"
            },
        ]
    })

    const localAuth = async() => {
        let userID = await AsyncStorage.getItem("user")
        setUser(userID)
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
        if(user) {
            let connection = io(SOCKET_URL)
            setSocket(connection)

            connection.emit("new-player", user)
            console.log("registered with socket")
        }
    }, [user])

    useEffect(() => {
        if(socket) {
            socket.on("cannot-join", () => {
                console.log("could not join")
            })
        }
    }, [socket])    

    return(
        <SocketContext.Provider
            value={{
                socket,
                user,
                question,

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