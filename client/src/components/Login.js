import React from 'react';
import { useState } from 'react';
import '../App.css';

const SERVER_PORT = 3000;

function Login() {
    const [users, setUsers] = useState(false);

    async function login() {
        const email = document.getElementById("email").value;
        const enteredPassword = document.getElementById("password").value;
        const response = await fetch(`http://localhost:${SERVER_PORT}/auth/in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ email, enteredPassword }),
        });
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