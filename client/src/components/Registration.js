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

function Registration() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [message, setMessage] = useState(false);
    
    function makeUserInfo(email, name, password, repeatedPassword) {
        if (!email || !name || !password || !repeatedPassword) {
            setMessage("Please fill all fields in.");
            return;
        }
        if (password !== repeatedPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        const salt = createSalt();
        const hash = createHash('sha256').update(password + salt).digest('hex');
        setMessage("");
        return { email, name, hash, salt };
    }
    
    function handleEmailChange(e) {
        setEmail(e.target.value);
    }
    
    function handleNameChange(e) {
        setName(e.target.value);
    }
    
    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }
    
    function handleRepeatedPasswordChange(e) {
        setRepeatedPassword(e.target.value);
    }

    function createUser() {
        const information = makeUserInfo(email, name, password, repeatedPassword);
        if (information === undefined) return;
        fetch(`http://127.0.0.1:${SERVER_PORT}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(information),
        });
    }
    
    return (
        <div className="App">
            <label id="notification" value={message}></label><br></br>
            <input type="text" id="email" name="email" placeholder="email@example.com" value={email} onChange={handleEmailChange}></input><br></br>
            <input type="text" id="name" name="name" placeholder="Username" value={name} onChange={handleNameChange}></input><br></br>
            <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={handlePasswordChange}></input><br></br>
            <input type="password" id="repeatedPassword" name="repeatedPassword" placeholder="Repeat password" value={repeatedPassword} onChange={handleRepeatedPasswordChange}></input><br></br>
            <button type="submit" onClick={createUser}>Submit</button>
        </div>
    );
}

export default Registration;
