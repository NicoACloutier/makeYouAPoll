import React from 'react';
import { useState, useEffect } from 'react';

const SERVER_PORT = 3000;

async function getUser() {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
    if (response === undefined || response.status !== 200) { return {}; }
    else return await response.json();
}

function Home() {
    const [name, setName] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUser();
            setName(data.name);
            setId(data.id);
        }
        fetchData();
    }, []);

    async function changeName() {
        const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/users?newName=${name}&id=${id}`, { method: 'PUT', credentials: 'include' });
    }
    
    return (
        <div className="App">
            <input onChange={e => setName(e.target.value)} placeholder="New name"></input><br />
            <button onClick={changeName}>Confirm name change</button> 
            <button>Reset password</button>
        </div>
    );
}

export default Home;
