import React from 'react';
import './App.css';
import { createHashRouter, RouterProvider } from "react-router-dom";

import Registration from './components/Registration.js';

const router = createHashRouter([
  {
    path: "/register",
    element: <Registration />,
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
