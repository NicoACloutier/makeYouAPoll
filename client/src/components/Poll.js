import React from 'react';
import { useState, useEffect } from 'react';
import '../App.css';

const SERVER_PORT = 3000;

async function getNumResponses(pollId, nAnswers) {
    const responseNumbers = []
    for (let i = 0; i < nAnswers; i++) {
        const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/entries?poll_id=${pollId}&answer_id=${i}`, { method: 'GET' });
        responseNumbers[i] = await response.json();
    }
    return responseNumbers;
}

async function getPoll(pollId) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/polls?id=${pollId}`, { method: 'GET' });
    const answers = await fetch(`http://127.0.0.1:${SERVER_PORT}/answers?poll_id=${pollId}`, { method: 'GET' });
    const data = await response.json();
    data.answers = (await answers.json()).map(x => x.answer_text);
    data.responseCounts = await getNumResponses(pollId, data.n_options);

    return data;
}

async function getEntry(userId, pollId) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/entries?user_id=${userId}&poll_id=${pollId}`, { method: 'GET' });
    const numEntries = await response.json();
    return numEntries > 0;
}

async function getOriginator(userId) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/users?id=${userId}`, { method: 'GET' });
    return await response.json();
}

function Poll() {
    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState([]);
    const [user, setUser] = useState({});
    const [originator, setOriginator] = useState({});
    const [pollId, setPollId] = useState(undefined);
    const [choice, setChoice] = useState(undefined);
    const [entered, setEntered] = useState(false);
    const [ownPoll, setOwnPoll] = useState(false);
    const [timeIsUp, setTimeIsUp] = useState(false);
    const [responseCounts, setResponseCounts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    function submit() {
        if (choice !== undefined && pollId !== undefined && user !== undefined) {
            fetch(`http://127.0.0.1:${SERVER_PORT}/entries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ poll_id: pollId, answer_id: choice, user_id: user.id }),
            });
            const newCounts = [...responseCounts];
            newCounts[choice] += 1;
            setTotalCount(totalCount + 1);
            setResponseCounts(newCounts);
            setEntered(true);
        }
    }

    const makeAnswer = (answer, i) => {
        return <li key={answer}><input type="radio" checked={i === choice} onClick={x => setChoice(i)}></input><span>{answer}</span></li>;
    }

    const makeDisplayAnswer = (answer, i) => {
        const numResponses = responseCounts[i];
        if (totalCount === 0) {
            return <p key={i}>{answer} ({numResponses})</p>;
        }
        else if (numResponses === 0) {
            return <p key={i}>{answer} ({numResponses})</p>;
        }
        const percentage = Math.floor(100 * (numResponses / totalCount) * 0.7);
        return <p className="bar" style={{width: `${percentage}%`}} key={i}>{answer} ({numResponses})</p>;
    }
    
    useEffect(() => {
        const fetchData = async () => {
            const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
            const authData = await authResponse.json();
            if (authResponse.status === 200) {
                setUser(authData);
            }
            const id = window.location.hash.match(/poll\?p=([^&/]+)/)[1];
            const data = await getPoll(id);
            const entered = await getEntry(authData.id, id);
            setOriginator(await getOriginator(data.user_id));
            setEntered(entered);
            setOwnPoll(data.user_id === authData.id);
            setPollId(id);
            setResponseCounts(data.responseCounts);
            setTotalCount(data.responseCounts.reduce((total, current) => { return total + current; }, 0));
            setTimeIsUp(Date.parse(new Date()) > Date.parse(data.end_time));
            setQuestion(data.question);
            setAnswers(data.answers);
        }
        fetchData();
    }, []);
    
    if (user.id === undefined) {
        return (
            <div className="App">
                <p className="post-title">{question}</p>
                <ul>{answers.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
        );
    }
    else if (entered || ownPoll || timeIsUp) {
        return (
            <div className="App">
                <p>
                    <span className="post-title">{question}</span>
                    <a href={`/#/user?u=${originator.name}`} className="post-user">{originator.name}</a>
                </p>
                <div>{answers.map(makeDisplayAnswer)}</div>
            </div>
        );
    }
    else {
        return (
            <div className="App">
                <p className="post-title">{question}</p>
                <ul>{answers.map(makeAnswer)}</ul>
                <button type="submit" onClick={submit}>Submit</button>    
            </div>
        );
    }
    
}

export default Poll;
