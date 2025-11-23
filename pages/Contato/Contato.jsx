import React from 'react';
import { colors } from '../../src/styles/colors';
import './Contato.css';

const Contato = () => {
  return (
    <div className="contato-page">
      <div className="contato-container">
        <h2 className="contato-title">Entre em Contato</h2>
        <p className="contato-description">
          Tem uma sugestão? Quer colaborar? Mande sua mensagem!
        </p>
        
        <form className="contato-form">
          <input 
            type="text" 
            placeholder="Seu nome" 
            className="form-input"
          />
          <input 
            type="email" 
            placeholder="Seu e-mail" 
            className="form-input"
          />
          <textarea 
            placeholder="Sua mensagem" 
            rows="6" 
            className="form-textarea"
          />
          <button type="submit" className="form-button">
            Enviar Mensagem
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contato;