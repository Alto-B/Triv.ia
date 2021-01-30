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
    const [registered, setRegistered] = useState(false)

    const localAuth = async() => {
        let userID = await AsyncStorage.getItem("user")
        setUser(userID)
    }

    useEffect(() => {
        localAuth()
    }, [])

    useEffect(() => {
        return () => {
            if(!socket) console.log('oogabooga')
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

    return(
        <SocketContext.Provider
            value={{
                socket,
                user,

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