import React from 'react';
import { useState } from 'react';
import '../App.css';
import { createHash } from 'crypto';

const SALT_LENGTH = 20;
const SALT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+`~;:[{]}/?.>,<';
const SERVER_PORT = 3000;

/*
Create the salt for authentication.
Arguments:
Returns:
    `salt`: A string of length `SALT_LENGTH` of randomly selected characters from `SALT_CHARS`.
*/
function createSalt() {
    let salt = '';
    const numCharacters = SALT_CHARS.length;
    let counter = 0;
    while (counter < SALT_LENGTH) {
      salt += SALT_CHARS.charAt(Math.floor(Math.random() * numCharacters));
      counter += 1;
    }
    return salt;
}

function makeUserInfo() {
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const repeatedPassword = document.getElementById("repeatedPassword").value;
    
    if (!email || !name || !password || !repeatedPassword) {
        document.getElementById("notification").innerHTML = "Please fill all fields in.";
        return;
    }
    if (password !== repeatedPassword) {
        document.getElementById("notification").innerHTML = "Passwords do not match.";
        return;
    }
    
    const salt = createSalt();
    const hash = createHash('sha256').update(password + salt).digest('hex');
    
    document.getElementById("notification").innerHTML = "";
    return { email, name, hash, salt };
}

function Registration() {
    const [users, setUsers] = useState(false);

    function getUser() {
        fetch(`http://localhost:${SERVER_PORT}`).then(response => {
            return response.text();
        }).then(data => {
            setUsers(data);
        });
    }
    
    function createUser() {
        const information = makeUserInfo();
        console.log(information);
        if (information === undefined) return;
        fetch(`http://localhost:${SERVER_PORT}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(information),
        }).then(response => {
            return response.text();
        }).then(data => {
            alert(data);
            getUser();
        });
    }
    
    return (
        <div className="App">
            <label id="notification"></label><br></br>
            <input type="text" id="email" name="email" placeholder="email@example.com"></input><br></br>
            <input type="text" id="name" name="name" placeholder="Username"></input><br></br>
            <input type="password" id="password" name="password" placeholder="Password"></input><br></br>
            <input type="password" id="repeatedPassword" name="repeatedPassword" placeholder="Repeat password"></input><br></br>
            <button type="submit" onClick={createUser}>Submit</button>
        </div>
    );
}

export default Registration;
