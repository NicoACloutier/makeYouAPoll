import React from 'react';
import './App.css';
import { createHashRouter, RouterProvider } from "react-router-dom";

import Registration from './components/Registration.js';
import Login from './components/Login.js';

const router = createHashRouter([
  {
    path: "/register",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />,
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
