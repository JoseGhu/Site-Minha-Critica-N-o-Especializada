import React, { useState } from 'react';
import { Mail, Check, X } from 'lucide-react';
import './Newsletter.css';

const Newsletter = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // '', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Por favor, digite seu e-mail');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setMessage('Por favor, digite um e-mail válido');
      return;
    }

    try {
      // Simular envio para API
      setStatus('loading');
      
      // Salvar no localStorage (substitua por API real)
      const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
      
      if (subscribers.includes(email)) {
        setStatus('error');
        setMessage('Este e-mail já está inscrito!');
        return;
      }
      
      subscribers.push(email);
      localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('Inscrição realizada com sucesso! Obrigado 🎬');
      setEmail('');
      
      // Resetar após 5 segundos
      setTimeout(() => {
        setStatus('');
        setMessage('');
      }, 5000);
      
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao realizar inscrição. Tente novamente.');
    }
  };

  return (
    <div className={`newsletter ${darkMode ? 'dark' : ''}`}>
      <div className="newsletter-content">
        <div className="newsletter-icon">
          <Mail size={32} />
        </div>
        
        <div className="newsletter-text">
          <h3>Fique por dentro das novidades!</h3>
          <p>Receba as melhores críticas e análises diretamente no seu e-mail.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="newsletter-input"
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="newsletter-button"
            >
              {status === 'loading' ? '...' : 'Inscrever'}
            </button>
          </div>
        </form>
      </div>

      {message && (
        <div className={`newsletter-message ${status}`}>
          {status === 'success' ? <Check size={16} /> : <X size={16} />}
          {message}
        </div>
      )}
    </div>
  );
};

export default Newsletter;