import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SERVER_PORT = 3000;

async function getPosts(id) {
    const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
    const authData = await authResponse.json();
    if (authResponse.status === 200 && authData.id === id) {
        let polls = await fetch(`http://127.0.0.1:${SERVER_PORT}/polls`, { method: 'GET', });
        polls = await polls.json();
        for (let i = 0; i < polls.length; i++) {
            const pollId = polls[i].poll_id;
            const answer = await fetch(`http://127.0.0.1:${SERVER_PORT}/answers?poll_id=${pollId}`, { method: 'GET', });
            polls[i].answers = (await answer.json()).map(x => x.answer_text);
        }
        return polls;
    }
    return [];
}

async function getUser() {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
    if (response === undefined || response.status !== 200) { return {}; }
    else {
        const data = await response.json();
        const polls = await getPosts(data.id);
        data.polls = polls;
        return data;
    }
}

function makePoll(pollInfo, i) {
    return (
        <li key={i}>
            <p><a href={`/#/poll?p=${pollInfo.poll_id}`}>{pollInfo.question}</a></p>
            <ul>{pollInfo.answers.map(x => <li key={x}>{x}</li>)}</ul>
        </li>
    );
}

function makePolls(polls) {
    if (polls !== undefined) {
        return (
            <ul>{polls.map(makePoll)}</ul>
        );
    }
    else { return <ul></ul>; }
}

function Home({ setUserData }) {
    const [polls, setPolls] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUser();
            if (data.name === undefined && data.polls === undefined) {
                navigate('/login', { replace: true });
            }
            setPolls(data.polls);
            setUserData(data);
        }
        fetchData();
    }, []);
    
    function search(e) {
        if (e.key === "Enter") navigate(`../search?q=${e.target.value}`, { replace: true });
    }

    return (
        <div className="App">
            <input placeholder="Search" className="searchbar" onKeyDown={search}/>
            <h1>Recent polls</h1>
            <div>{makePolls(polls)}</div>
        </div>
    );
}

export default Home;
