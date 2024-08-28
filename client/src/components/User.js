import React from 'react';
import { useState, useEffect } from 'react';
import queryString from 'query-string';

const SERVER_PORT = 3000;

async function getPosts(id) {
    let polls = await fetch(`http://127.0.0.1:${SERVER_PORT}/polls?user_id=${id}`, { method: 'GET', });
    polls = (await polls.json());
    for (let i = 0; i < polls.length; i++) {
        const pollId = polls[i].poll_id;
        const answer = await fetch(`http://127.0.0.1:${SERVER_PORT}/answers?poll_id=${pollId}`, { method: 'GET', });
        polls[i].answers = await answer.json();
    }
    return polls;
}

async function getUser(name) {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/users?userName=${name}`, { method: 'GET' });
    if (response === undefined || response.status !== 200) { return {}; }
    else {
        const data = await response.json();
        const polls = await getPosts(data.user_id);
        data.polls = polls;
        return data;
    }
}

function makePoll(pollInfo, i) {
    return (
        <div className="post-para" href={`/#/poll?p=${pollInfo.poll_id}`}>
            <a className="post" href={`/#/poll?p=${pollInfo.poll_id}`}>
                <p className="poll-text">{pollInfo.question}
                    <span className="poll-user">{pollInfo.userName}</span>
                </p>
                <ul>{pollInfo.answers.map(x => <li>{x.answer_text}</li>)}</ul>
            </a>
        </div>
    );
}

function makePolls(polls) {
    if (polls !== undefined) {
        return (
            <div>{polls.map(makePoll)}</div>
        );
    }
    else { return <div></div>; }
}

function User() {
    const [name, setName] = useState('');
    const [polls, setPolls] = useState([]);
    
    useEffect(() => {
        const userName = window.location.hash.match(/[?&]u=([^&/]+)/)[1];
        const fetchData = async () => {
            const data = await getUser(userName);
            setName(data.name);
            setPolls(data.polls);
        }
        fetchData();
    }, []);
    
    
    return (
        <div className="App">
            <h1>{name}</h1>
            <div>{makePolls(polls)}</div>
        </div>
    );
}

export default User;
