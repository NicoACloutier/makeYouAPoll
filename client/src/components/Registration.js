import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;

function Registration() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
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

    async function createUser() {
        if (!email || !name || !password || !repeatedPassword) {
            setMessage("Please fill all fields in.");
            return;
        }
        if (password !== repeatedPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        const registerResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ name, email, password }),
        });
        if (registerResponse.status !== 200) {
            setMessage("An error occurred on the server. Try again later.");
            return;
        }
        const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth/in`, {
            method: 'POST',
            credentials: 'include',
            withCredentials: true,
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ email, password }),
        });
        if (response.status === 200) {
            navigate('/', { replace: true });
            return;
        }
        navigate('/login', { replace: true });
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
