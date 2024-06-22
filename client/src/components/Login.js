import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;

function Login() {
    const [email, setEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function login() {
        setMessage("");
        const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth/in`, {
            method: 'POST',
            credentials: 'include',
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ email, enteredPassword }),
        });
        if (response.status === 200) {
            navigate('/', { replace: true });
        }
        else if (response.status === 401) { setMessage("Incorrect username or password."); }
    }
    
    function handleEmailChange(e) {
        setEmail(e.target.value);
    }
    
    function handleEnteredPasswordChange(e) {
        setEnteredPassword(e.target.value);
    }
    
    return (
        <div className="App">
            <label id="notification">{message}</label><br></br>
            <input type="text" id="email" name="email" placeholder="email@example.com" onChange={handleEmailChange}></input><br></br>
            <input type="password" id="password" name="password" placeholder="Password" onChange={handleEnteredPasswordChange}></input><br></br>
            <button type="submit" onClick={login}>Submit</button>
        </div>
    );
}

export default Login;