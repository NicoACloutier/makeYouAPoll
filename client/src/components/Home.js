import React from 'react';
import { useState } from 'react';

const SERVER_PORT = 3000;

function Home() {
    const [users, setUsers] = useState(false);

    async function getUser() {
        const response = await fetch(`http://localhost:${SERVER_PORT}/auth`, {
            method: 'GET',
        });
        if (response === undefined) { return { name: undefined }; }
        return response.json();
    }

    return (
        <div className="App">
            <label id="notification" value={getUser()["name"]}></label>
        </div>
    );
}

export default Home;