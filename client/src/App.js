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
import Profile from './components/Profile.js';
import NotFound from './components/NotFound.js';

const SERVER_PORT = 3000;

async function getUser() {
    const response = await fetch(`http://127.0.0.1:${SERVER_PORT}/auth`, { method: 'GET', credentials: 'include' });
    if (response === undefined || response.status != 200) { return undefined; }
    return await response.json();
}

function App() {
    const [userData, setUserData] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [sideBarList, setSideBarList] = useState([]);

    const router = createHashRouter([
        {
            path: "/",
            element: <Home setUserData={x => setUserData(x)}/>,
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
            path: "/profile",
            element: <Profile />,
        },
        {
            path: "*",
            element: <NotFound />,
        },
    ]);
    
    const notLoggedRouter = createHashRouter([
        {
            path: '/',
            element: <Login setLoggedIn={x => setLoggedIn(x)}/>,
        },
        {
            path: '/register',
            element: <Registration />,
        },
        {
            path: '*',
            element: <NotFound />
        },
    ]);
    
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
                <div class="App">
                    <div class="sidenav container">
                        <p class="sidenav-text">Make you a poll</p>
                        <p class="sidenav-para"><a class="sidenav-item" href="./#/">Home</a></p>
                        <p class="sidenav-para"><a class="sidenav-item" href="./#/create">Create</a></p>
                        <p class="sidenav-para"><a class="sidenav-item" href="./#/profile">Profile</a></p>
                        <p class="sidenav-text">{userData.name}</p>
                        <p class="sidenav-para"><a class="sidenav-item" href="./#/" onClick={x => logout()}>Logout</a></p>
                    </div>
                    <RouterProvider router={router} />
                </div>
            </React.StrictMode>
        );
    }
    else {
        return (
            <React.StrictMode>
                <div class="login">
                    <RouterProvider router={notLoggedRouter} />
                </div>
            </React.StrictMode>
        );
    }
}

export default App;
