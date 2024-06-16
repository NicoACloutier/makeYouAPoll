import React from 'react';

const SERVER_PORT = 3000;

async function getPosts(id) {
    const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
    const authData = await authResponse.json();
    if (authResponse.status === 200 && authData.id === id) {
        let polls = await fetch(`http://127.0.0.1:${SERVER_PORT}/polls?user_id=${id}`, { method: 'GET', });
        polls = (await polls.json()).slice(0, 5);
        for (let i = 0; i < polls.length; i++) {
            const pollId = polls[i].poll_id;
            const answer = await fetch(`http://127.0.0.1:${SERVER_PORT}/answers?poll_id=${id}`, { method: 'GET', });
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

function makePoll(pollInfo) {
    return (
        <li>
            <p>{pollInfo.question}</p>
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

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const ret = await getUser();
        this.setState(ret);
    }
    
    render() {
        return (
            <div className="App">
                <h1>{this.state.name}</h1>
                <div>{makePolls(this.state.polls)}</div>
            </div>
        );
    }
}

export default Home;