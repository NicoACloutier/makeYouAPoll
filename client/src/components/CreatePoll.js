import React from 'react';
import '../App.css';

const SERVER_PORT = 3000;

function CreatePoll() {
    async function createPoll() {
    }
    
    return (
        <div className="App">
            <label id="notification"></label><br></br>
            <div>Question: </div><input type="text" id="question" name="question" placeholder="Poll question"></input><br></br>
            <button type="submit" onClick={createPoll}>Submit</button>
        </div>
    );
}

export default CreatePoll;