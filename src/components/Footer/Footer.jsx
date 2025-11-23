import React from 'react';
import { colors } from '../../styles/colors';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <img 
          src="/images/logo-minha-critica.png" 
          alt="Minha Crítica Não Especializada" 
          className="footer-logo"
        />
        <p className="footer-description">
          Opiniões sinceras sobre cinema e séries, sem frescura.
        </p>
        <div className="footer-links">
          <a 
            href="https://www.instagram.com/minhacriticanaoespecializada/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Instagram
          </a>
        </div>
        <p className="footer-copyright">
          © 2025 Minha Crítica Não Especializada. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;