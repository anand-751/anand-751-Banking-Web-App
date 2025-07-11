import React from 'react';
import ReactDOM from 'react-dom'; // Updated for React 18
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot for React 18

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
