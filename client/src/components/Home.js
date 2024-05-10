import React from 'react';
import { useState } from 'react';

const SERVER_PORT = 3000;

async function getUser() {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', },
        credentials: 'include'
    });
    if (response === undefined || response.status !== 200) { return { name: undefined }; }
    return response.json();
}

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { id: undefined, name: undefined, email: undefined };
    }
    
    componentDidMount() {
        getUser().then(ret => this.setState(ret));
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