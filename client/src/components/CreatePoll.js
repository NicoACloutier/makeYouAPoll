import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;

function PollCreate() {
    const [answers, setAnswers] = useState(["", ""]);
    const [question, setQuestion] = useState("");
    const [endTime, setEndTime] = useState("");
    const [nAnswers, setNAnswers] = useState(2);
    const navigate = useNavigate();
    
    function setAnswer(e, i) {
        answers[i] = e.target.value;
    }
    
    function updateQuestion(e) {
        setQuestion(e.target.value);
    }
    
    function updateEndTime(e) {
        setEndTime(e.target.value);
    }

    async function updateValue(e) {
        const value = parseInt(e.target.value);
        setNAnswers(value);
        if (answers.length < value) {
            while (answers.length !== value) { answers.push(""); }
        }
        else if (answers.length > value) {
            while (answers.length !== value) { answers.pop(); }
        }
    }
    
    function renderAnswer(i) {
        return <div><input type="text" className="form-input" id={`ans${i}`} key={`ans${i}`} defaultValue={answers[i]} onChange={e => setAnswer(e, i)}></input><br /></div>;
    }
    
    function renderAnswers() {
        let renderedAnswers = [];
        for (let i = 0; i < answers.length; i++) {
            renderedAnswers.push(renderAnswer(i));
        }
        return <div>{renderedAnswers}<br /></div>;
    }
    
    async function createAnswers(pollId) {
        for (let i = 0; i < answers.length; i++) {
            const answer = answers[i];
            fetch(`http://127.0.0.1:${SERVER_PORT}/answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ poll_id: pollId, answer_id: i, answer_text: answer }),
            });
        }
    }
    
    async function createPoll() {
        const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
        const authData = await authResponse.json();
        if (authResponse.status === 200) {
            const id = authData.id;
            const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/polls`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ nAnswers, id, question, endTime }),
            });
            const data = await response.json();
            createAnswers(data.id);
            navigate('/', { replace: true });
        }
    }
    
    return (
        <div className="App">
            <h3>Question: </h3><input className="form-input" type="text" name="question" placeholder="Poll question" onChange={updateQuestion}></input>
            <h3>End time: </h3><input type="text" name="time" className="form-input" placeholder="YYYY-MM-DD" onChange={updateEndTime}></input>
            <h3>Answers ({nAnswers}): </h3><input type="range" min="2" max="20" defaultValue="2" name="slider" id="slider" onChange={updateValue}></input>
            <div>{renderAnswers()}</div>
            <button type="submit" className="form-button" onClick={createPoll}>Submit</button>
        </div>
    );
}

export default PollCreate;
