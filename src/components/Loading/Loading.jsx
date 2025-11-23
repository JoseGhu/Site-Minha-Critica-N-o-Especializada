import React from 'react';
import './Loading.css';

const Loading = ({ message = "Carregando..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">🎬</div>
      <h2 className="loading-text">{message}</h2>
    </div>
  );
};

export default Loading;