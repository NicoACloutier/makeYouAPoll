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
    const [message, setMessage] = useState('');

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
        if (response.status === 200) setMessage("Name changed successfully. Log out and log back in to see results.");
        else setMessage("There was an error in the name change.")
    }
    
    return (
        <div className="App">
            <h3>Change username</h3>
            <input className="form-input" onChange={e => setName(e.target.value)} placeholder="New name"></input><br />
            <button className="form-button" onClick={changeName}>Confirm name change</button>
            <p>{message}</p> 
        </div>
    );
}

export default Home;
