import React from 'react';
import '../App.css';

const SERVER_PORT = 3000;

function CreatePoll() {
    async function createAnswers() {}
    
    async function createPoll() {
        const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
        const authData = await authResponse.json();
        if (authResponse.status === 200) {
            const question = document.getElementById("question").value;
            const end = document.getElementById("time").value;
            const nAnswers = document.getElementById("slider").value;
            fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, {
                method: 'POST',
                body: JSON.stringify({ nAnswers, authData.id, question, end }),
            });
            createAnswers();
        }
    }
    
    return (
        <div className="App">
            <label id="notification"></label><br></br>
            <div>Question: </div><input type="text" id="question" name="question" placeholder="Poll question"></input><br></br>
            <div>End time: </div><input type="text" id="time" name="time" placeholder="YYYY-MM-DD"></input><br></br>
            <div>Answers: <input type="range" min="2" max="20" value="2" id="slider"><br></br>
            <button type="submit" onClick={createPoll}>Submit</button>
        </div>
    );
}

export default CreatePoll;