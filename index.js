import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js'; // ✅ ADICIONE .js
import './src/styles/global.css'; // Vamos criar este arquivo

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);