import React from 'react';
import { useState } from 'react';
import '../App.css';
import { createHash } from 'crypto';

const SERVER_PORT = 3000;

function informationMatches(enteredPassword, salt, hash) {
    const newHash = createHash('sha256').update(enteredPassword + salt).digest('hex');
    return newHash === hash;
}

function Login() {
    const [users, setUsers] = useState(false);

    function getUser() {
        fetch(`http://localhost:${SERVER_PORT}`).then(response => {
            return response.text();
        }).then(data => {
            setUsers(data);
        });
    }
    
    async function findUser(email) {
        const response = await fetch(`http://localhost:${SERVER_PORT}/users?email=${email}`, {
            method: 'GET',
        });
        if (response === undefined) { return undefined; }
        return response.json();
    }
    
    async function login() {
        const email = document.getElementById("email").value;
        const enteredPassword = document.getElementById("password").value;
        const userInfo = await findUser(email);
        if (userInfo === undefined) { 
            document.getElementById("notification").innerHTML = "No user found.";
            return;
        }
        
        if (informationMatches(enteredPassword, userInfo["salt"], userInfo["hash"])) {
            document.getElementById("notification").innerHTML = "Success.";
        }
        else { document.getElementById("notification").innerHTML = "No match."; }
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