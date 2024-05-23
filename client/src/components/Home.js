import React from 'react';

const SERVER_PORT = 3000;

async function getPosts(id) {
    const authResponse = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
    if (authResponse.status === 200) {
        let polls = await fetch(`http://127.0.0.1:${SERVER_PORT}/polls?user_id=${id}`, { method: 'GET', });
        polls = (await polls.json()).slice(0, 5);
        for (let i = 0; i < polls.length; i++) {
            const pollId = polls[i].poll_id;
            const answer = await fetch(`http://127.0.0.1:${SERVER_PORT}/answers?poll_id=${id}`, { method: 'GET', });
            polls[i].answers = await answer.json();
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

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: undefined, name: undefined, email: undefined, answers: undefined, polls: undefined };
    }

    async componentDidMount() {
        const ret = await getUser();
        this.setState(ret);
    }
    
    render() {
        return (
            <div className="App">
                <h1>{this.state.name}</h1>
            </div>
        );
    }
}

export default Home;