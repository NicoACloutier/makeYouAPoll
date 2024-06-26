import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';

const SERVER_PORT = 3000;

async function getPoll(pollId) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/polls?id=${pollId}`, { method: 'GET' });
    return response;
}

function Poll() {
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState([]);
    
    useEffect(() => {
        const pollId = window.location.hash.match(/[?&]p=([^&]+)[&]?/)[1];
        const fetchData = async () => {
            const data = await getPoll(pollId);
            setQuestion(data.question);
            setAnswers(data.answers);
        }
        fetchData();
    }, []);
    
    return (
        <li>
            <p>{question}</p>
            <ul>{answers.map(x => <li key={x}>{x}</li>)}</ul>
        </li>
    );
}

export default Login;