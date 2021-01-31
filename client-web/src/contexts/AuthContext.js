import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userId, setUserId] = useState("");
    const API = "http://localhost:5000/api";
    const history = useHistory();

    useEffect(() => {
        if(localStorage.getItem('token')){
            history.push('/app/dashboard')
        }
    },[history])
    
    return(
        <AuthContext.Provider value={{
            userId,
            login: async (args) => {
                
                const {username, password} = args;

                axios.post(`${API}/login`, {username: username, password: password})
                .then(result => {
                    localStorage.setItem('token', result.data.token)
                    setUserId(result.data.userID)

                    history.push("/app/dashboard")
                })
                .catch(error => {
                    console.log(error.response.data.message);
                })
            },

            signup: async (args) => {
                const {username, password} = args;

                axios.post(`${API}/signup`, {username: username, password: password})
                .then(result => {
                    localStorage.setItem('token', result.data.token);
                    setUserId(result.data.userID)

                    history.push("/app/dashboard")
                })
                .catch(error => {
                    console.log(error.response.data.message);
                })
            }
        }}>
            {children}
        </AuthContext.Provider>
    );

}