import React from 'react';
import { useState } from 'react';
import '../App.css';

const SERVER_PORT = 3000;

function Registration() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [message, setMessage] = useState('');
    
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
        if (!email || !name || !password || !repeatedPassword) {
            setMessage("Please fill all fields in.");
            return;
        }
        if (password !== repeatedPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        fetch(`http://127.0.0.1:${SERVER_PORT}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ name, email, password }),
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
