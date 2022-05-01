import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FakeStackOverflow from './components/fakestackoverflow.js';
import { createRoot } from 'react-dom/client' 
import{
    BrowserRouter as Router,
} from "react-router-dom"

createRoot(document.getElementById('root')).render(
    <Router>
        <FakeStackOverflow />
    </Router>
)
