import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { createHashRouter, RouterProvider } from "react-router-dom";

import Registration from './components/Registration.js';
import Login from './components/Login.js';
import Home from './components/Home.js';
import User from './components/User.js';
import CreatePoll from './components/CreatePoll.js';
import Poll from './components/Poll.js';
import NotFound from './components/NotFound.js';

const SERVER_PORT = 3000;

const router = createHashRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/register",
        element: <Registration />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/user",
        element: <User />,
    },
    {
        path: "/create",
        element: <CreatePoll />,
    },
    {
        path: "/poll",
        element: <Poll />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

async function getUser() {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
    if (response === undefined || response.status != 200) { return undefined; }
    return await response.json();
}

function App() {
    const [userData, setUserData] = useState(undefined);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUser();
            if (data === undefined) setLoggedIn(false);
            else { setLoggedIn(true); setUserData(data); }
        }
    }, []);

    function logout() {
        fetch(`http://127.0.0.1:${SERVER_PORT}/auth/out`, { method: 'POST', credentials: 'include' });
        setLoggedIn(false);
    }

    if (loggedIn) {
        return (
            <React.StrictMode>
                <div class="sidenav">
                    <p>Make you a poll</p>
                    <button onClick={logout}>Log out</button>
                </div>
                <RouterProvider router={router} />
            </React.StrictMode>
        );
    }
    else {
        return (
            <React.StrictMode>
                <Login setLoggedIn={x => setLoggedIn(x)} />
            </React.StrictMode>
        );
    }
}

export default App;
