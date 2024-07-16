import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';

const SERVER_PORT = 3000;

async function getPoll(pollId) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/polls?id=${pollId}`, { method: 'GET' });
    const answers = await fetch(`http://127.0.0.1:${SERVER_PORT}/answers?poll_id=${pollId}`, { method: 'GET' });
    const data = await response.json();
    data.answers = (await answers.json()).map(x => x.answer_text);
    return data;
}

async function getEntry(userId, pollId) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/entries?user_id=${userId}&poll_id=${pollId}`, method: { 'GET' });
    const numEntries = await response.json();
    return numEntries > 0;
}


function Poll() {
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState([]);
    const [user, setUser] = useState({});
    const [pollId, setPollId] = useState(undefined);
    const [choice, setChoice] = useState(undefined);
    const [entered, setEntered] = useState(false);
    const [ownPoll, setOwnPoll] = useState(false);

    function submit() {
        if (choice !== undefined && pollId !== undefined && user !== undefined) {
            fetch(`http://127.0.0.1:${SERVER_PORT}/entries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ poll_id: pollId, answer_id: choice, user_id: user.id }),
            })
        }
    }

    const makeAnswer = (answer, i) => {
        return <li key={answer}><input type="radio" checked={i === choice} onClick={x => setChoice(i)}></input><span>{answer}</span></li>;
    }

    const makeDisplayAnswer = async (answer, i) => {
        const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/entries?poll_id=${pollId}&answer_id=${i}`, method: { 'GET' });
        const numResponses = await response.json();
        return <li key={i}>{answer} ({numResponses})</li>;
    }
    
    useEffect(() => {
        const fetchUser = async () => {
            const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
            const authData = await authResponse.json();
            if (authResponse.status === 200) {
                setUser(authData);
            }
        }
        fetchUser();
         
        const fetchData = async () => {
            const id = window.location.hash.match(/poll\?p=([^&/]+)/)[1];
            const data = await getPoll(id);
            const entered = await getEntry(id, user.id);
            setEntered(entered);
            setOwnPoll(data.user_id === user.id);
            setPollId(id);
            setQuestion(data.question);
            setAnswers(data.answers);
        }
        fetchData();
    }, []);
    
    if (user.id === undefined) {
        return (
            <div className="App">
                <p>{question}</p>
                <ul>{answers.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
        );
    }
    else if (entered || ownPoll) {
        return (
            <div className="App">
                <p>{question}</p>
                <ul>{answers.map(makeDisplayAnswer)}</ul>
            </div>
        );
    }
    else {
        return (
            <div className="App">
                <p>{question}</p>
                <ul>{answers.map(makeAnswer)}</ul>
                <button type="submit" onClick={submit}>Submit</button>    
            </div>
        );
    }
    
}

export default Poll;
