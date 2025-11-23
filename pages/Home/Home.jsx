import React from 'react';
import Banner from '../../components/Banner/Banner';
import PostCard from '../../components/PostCard/PostCard';
import { colors } from '../../src/styles/colors';
import './Home.css';

const Home = ({ 
  currentPage, 
  filteredPosts, 
  error, 
  onPostClick, 
  onReload 
}) => {
  return (
    <div className="home-page">
      <Banner />
      
      <div className="page-header">
        <h2 className="page-title">
          {currentPage === 'home' ? 'Últimas Publicações' : currentPage}
        </h2>
        <span className={`status-badge ${error ? 'error' : 'success'}`}>
          {error ? '📦 localStorage (Backup)' : '🗄️ MySQL Conectado'} • {filteredPosts.length} posts
        </span>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">📭 Nenhum post encontrado</p>
          <p className="empty-description">
            {error 
              ? 'Verifique se o backend está rodando em http://localhost:3001' 
              : 'Não há posts nesta categoria ainda.'
            }
          </p>
          {error && (
            <button onClick={onReload} className="reload-button">
              🔄 Tentar Reconectar
            </button>
          )}
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onClick={() => onPostClick(post)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;