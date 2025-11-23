import React from 'react';
import { Film, Tv, Newspaper, Mail, Home } from 'lucide-react';
import colors from '../../styles/colors';
import './Header.css';

const Header = ({ currentPage, setCurrentPage, onLogoDoubleClick }) => {
  const menuItems = [
    { name: 'Início', icon: Home, page: 'home' },
    { name: 'Críticas', icon: Film, page: 'críticas' },
    { name: 'Séries', icon: Tv, page: 'séries' },
    { name: 'Notícias', icon: Newspaper, page: 'notícias' },
    { name: 'Contato', icon: Mail, page: 'contato' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* LOGO */}
          <div 
            className="logo-container"
            onClick={() => setCurrentPage('home')}
            onDoubleClick={onLogoDoubleClick}
            title="Clique para ir ao início"
          >
            <div className="logo-placeholder">
              🎬 Minha Crítica
            </div>
          </div>
          
          {/* MENU */}
          <nav className="nav-menu">
            {menuItems.map(item => (
              <button 
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`nav-button ${currentPage === item.page ? 'active' : ''}`}
              >
                <item.icon size={18} /> 
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;