import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';


const SERVER_PORT = 3000;

async function getPolls(query) {
    const pollResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/polls?poll_name=${query}`, { method: 'GET' });
    const polls = await pollResponse.json();
    for (let i = 0; i < polls.length; i++) {
        const pollId = polls[i].poll_id;
        const answer = await fetch(`http://127.0.0.1:${SERVER_PORT}/answers?poll_id=${pollId}`, { method: 'GET' });
        polls[i].answers = (await answer.json()).map(x => x.answer_text);
    }
    return polls;
}

function makePoll(poll, i) {
    return (
        <li key={i}>
            <p><a href={`/#/poll?p=${poll.poll_id}`}>{poll.question}</a></p>
            <ul>{poll.answers.map((x, j) => <li key={j}>{x}</li>)}</ul>
        </li>
    );
}

function makePolls(polls) {
    if (polls !== undefined) {
        return (
            <ul>{polls.map(makePoll)}</ul>
        );
    }
    else return <ul />;
}

function Search() {
    const [polls, setPolls] = useState([]);
    const [message, setMessage] = useState('');
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const windowQuery = window.location.hash.match(/[?&]q=([^&/]+)/)[1];
        setQuery(windowQuery);
        const fetchData = async () => {
            const data = await getPolls(windowQuery);
            setPolls(data);
            if (data.length === 0) setMessage('No polls found.');
            else setMessage('');
        };
        fetchData();
    });
   
    function search(e) {
        if (e.key === "Enter") navigate(`../search?q=${e.target.value}`, { replace: true });
    }
     
    return (
        <div className="App">
            <input placeholder="Search polls" defaultValue={query.replace('%20', ' ')} className="searchbar" onKeyDown={search} />
            <p>{message}</p>
            <div>{makePolls(polls)}</div>
        </div>
    ); 
}

export default Search;
