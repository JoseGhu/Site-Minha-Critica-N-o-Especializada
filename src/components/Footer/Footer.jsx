import React from 'react';
import { Instagram, Mail, Heart } from 'lucide-react';
import Newsletter from '../Newsletter/Newsletter';
import './Footer.css';

const Footer = ({ darkMode, onToggleDarkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${darkMode ? 'dark' : ''}`}>
      <div className="footer-container">
        {/* Newsletter */}
        <Newsletter darkMode={darkMode} />
        
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src="/images/logo-minha-critica.png" 
                alt="Minha Crítica Não Especializada" 
                className="footer-logo-image"
              />
            </div>
            <p className="footer-description">
              Opiniões sinceras sobre cinema e séries, sem frescura.
            </p>
          </div>

          <div className="footer-section">
            <h4>Navegação</h4>
            <ul className="footer-links">
              <li><a href="#home">Início</a></li>
              <li><a href="#criticas">Críticas</a></li>
              <li><a href="#series">Séries</a></li>
              <li><a href="#noticias">Notícias</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contato</h4>
            <div className="footer-contact">
              <a 
                href="https://www.instagram.com/minhacriticanaoespecializada/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social"
              >
                <Instagram size={18} />
                @minhacriticanaoespecializada
              </a>
              <a 
                href="mailto:contato@minhacritica.com" 
                className="footer-social"
              >
                <Mail size={18} />
                contato@minhacritica.com
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Configurações</h4>
            <div className="footer-settings">
              <button 
                onClick={onToggleDarkMode}
                className="footer-setting-button"
              >
                {darkMode ? 'Modo Claro' : 'Modo Escuro'}
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Minha Crítica Não Especializada. Todos os direitos reservados.
          </p>
          <p className="footer-made-with">
            Feito com <Heart size={14} fill="#D32F2F" color="#D32F2F" /> para amantes de cinema
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;