import React from 'react';
import './App.css';
import { createHashRouter, RouterProvider } from "react-router-dom";

import Registration from './components/Registration.js';
import Login from './components/Login.js';
import Home from './components/Home.js';
import User from './components/User.js';
import CreatePoll from './components/CreatePoll.js';
import Poll from './components/Poll.js';

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
]);

function App() {
    return (
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}

export default App;
