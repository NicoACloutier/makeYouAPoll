import React from 'react';
import '../App.css';

const SERVER_PORT = 3000;
const answers = ["", ""];
let nFields = 2;

function changeAnswer(newAnswer, i) { answers[i] = newAnswer; }

function renderAnswer(answer, i) {
    return <input type="text" value={answer}></input>;
}

function renderAnswers() {
    return <div>{answers.map(renderAnswer)}</div>;
}

function updateValue(event, value) {
    const slider = document.getElementById("slider");
    slider.value = value;
    const previous = nFields;
    document.getElementById("sliderVal").innerHTML = slider.value;
    nFields = slider.value;
    if (previous < nFields) {
        for (let i = 0; i < nFields - previous; i++) { answers.pop(); }
    }
    else {
        for (let i = 0; i < previous - nFields; i++) { answers.push(""); }
    }
    document.getElementById("answerList").innerHTML = renderAnswers();
}

function CreatePoll() {
    async function createAnswers(pollId) {
        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            fetch(`http://127.0.0.1:${SERVER_PORT}/answers`, {
                method: 'POST',
                body: JSON.stringify({ pollId, i, answer }),
            });
        }
    }
    
    async function createPoll() {
        const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
        const authData = await authResponse.json();
        if (authResponse.status === 200) {
            const question = document.getElementById("question").value;
            const end = document.getElementById("time").value;
            const nAnswers = document.getElementById("slider").value;
            const id = authData.id;
            const response = fetch(`http://127.0.0.1:${SERVER_PORT}/polls`, {
                method: 'POST',
                body: JSON.stringify({ nAnswers, id, question, end }),
            });
            createAnswers(response.id);
        }
    }
    
    return (
        <div className="App">
            <label id="notification"></label><br></br>
            <div>Question: </div><input type="text" id="question" name="question" placeholder="Poll question"></input><br></br>
            <div>End time: </div><input type="text" id="time" name="time" placeholder="YYYY-MM-DD"></input><br></br>
            <div>Answers: </div><input type="range" min="2" max="20" value="2" name="slider" id="slider" onChangeCommitted={updateValue}></input><div id="sliderVal">{nFields}</div><br></br>
            <div id="answerList">{renderAnswers()}</div>
            <button type="submit" onClick={createPoll}>Submit</button>
        </div>
    );
}

export default CreatePoll;