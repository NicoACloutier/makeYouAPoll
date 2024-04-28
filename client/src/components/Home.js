import React from 'react';
import { useState } from 'react';

function Home() {
    const [users, setUsers] = useState(false);

    return (
        <div className="App">
            <label id="notification">Home</label>
        </div>
    );
}

export default Home;