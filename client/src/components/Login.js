import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;

function Login() {
    const [users, setUsers] = useState(false);
    const navigate = useNavigate();

    async function login() {
        const email = document.getElementById("email").value;
        const enteredPassword = document.getElementById("password").value;
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
    }
    
    return (
        <div className="App">
            <label id="notification"></label><br></br>
            <input type="text" id="email" name="email" placeholder="email@example.com"></input><br></br>
            <input type="password" id="password" name="password" placeholder="Password"></input><br></br>
            <button type="submit" onClick={login}>Submit</button>
        </div>
    );
}

export default Login;