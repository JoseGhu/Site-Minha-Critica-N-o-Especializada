import React, { useState } from 'react';
import { Film, Tv, Newspaper, Mail, Home, Search, Moon, Sun } from 'lucide-react';
import './Header.css';

const Header = ({ 
  currentPage, 
  setCurrentPage, 
  onLogoDoubleClick, 
  onSearch,
  darkMode,
  onToggleDarkMode 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setCurrentPage('search');
      setShowSearch(false);
    }
  };

  const menuItems = [
    { name: 'Início', icon: Home, page: 'home' },
    { name: 'Críticas', icon: Film, page: 'críticas' },
    { name: 'Séries', icon: Tv, page: 'séries' },
    { name: 'Notícias', icon: Newspaper, page: 'notícias' },
    { name: 'Contato', icon: Mail, page: 'contato' }
  ];

  return (
    <header className={`header ${darkMode ? 'dark' : ''}`}>
      <div className="header-container">
        <div className="header-content">
          {/* LOGO */}
          <div 
            className="logo-container"
            onClick={() => {
              setCurrentPage('home');
              setSearchTerm('');
            }}
            onDoubleClick={onLogoDoubleClick}
            title="Clique para ir ao início | Duplo clique para admin"
          >
            <img 
              src="/images/logo-minha-critica.png" 
              alt="Minha Crítica Não Especializada" 
              className="logo"
            />
          </div>
          
          {/* MENU E CONTROLES */}
          <div className="header-right">
            <nav className="nav-menu">
              {menuItems.map(item => (
                <button 
                  key={item.page}
                  onClick={() => {
                    setCurrentPage(item.page);
                    setSearchTerm('');
                  }}
                  className={`nav-button ${currentPage === item.page ? 'active' : ''}`}
                >
                  <item.icon size={18} /> 
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="header-controls">
              {/* DARK MODE TOGGLE */}
              <button 
                className="control-button"
                onClick={onToggleDarkMode}
                title={darkMode ? 'Modo claro' : 'Modo escuro'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* BUSCA */}
              <div className="search-container">
                <button 
                  className="control-button search-toggle"
                  onClick={() => setShowSearch(!showSearch)}
                  title="Buscar"
                >
                  <Search size={20} />
                </button>
                
                {showSearch && (
                  <form onSubmit={handleSearch} className="search-form">
                    <input
                      type="text"
                      placeholder="Buscar posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                      autoFocus
                    />
                    <button type="submit" className="search-submit">
                      <Search size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;