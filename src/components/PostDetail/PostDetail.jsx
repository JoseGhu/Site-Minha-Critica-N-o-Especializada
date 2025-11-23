import React from 'react';
import { Star, Calendar, Clock, Eye, ChevronLeft } from 'lucide-react';
import Comments from '../Comments/Comments';
import './PostDetail.css';

const PostDetail = ({ post, onBack, darkMode }) => {
  const views = JSON.parse(localStorage.getItem('post-views') || '{}')[post.id] || 0;

  return (
    <div className={`post-detail-container ${darkMode ? 'dark' : ''}`}>
      <button onClick={onBack} className="back-button">
        <ChevronLeft size={20} />
        Voltar para a lista
      </button>
      
      <article className="post-detail">
        <div className="post-detail-image-container">
          <img 
            src={post.image} 
            alt={post.title} 
            className="post-detail-image"
            loading="eager"
          />
        </div>
        
        <div className="post-detail-content">
          <div className="post-detail-badges">
            <span className="post-detail-type">{post.type}</span>
            {post.rating && (
              <span className="post-detail-rating">
                <Star size={16} fill="currentColor" />
                {post.rating} / 5
              </span>
            )}
          </div>
          
          <h1 className="post-detail-title">{post.title}</h1>
          
          <div className="post-detail-meta">
            <span className="post-detail-date">
              <Calendar size={16} />
              {new Date(post.date).toLocaleDateString('pt-BR')}
            </span>
            
            <div className="post-detail-stats">
              {post.readTime && (
                <span className="post-detail-read-time">
                  <Clock size={16} />
                  {post.readTime}
                </span>
              )}
              
              {views > 0 && (
                <span className="post-detail-views">
                  <Eye size={16} />
                  {views} visualizações
                </span>
              )}
            </div>
          </div>
          
          <div className="post-detail-body">
            {post.fullContent ? (
              <>
                {post.fullContent.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="post-paragraph">{paragraph}</p>
                ))}
                
                {post.highlights && post.highlights.length > 0 && (
                  <>
                    <h2 className="post-section-title">✅ O que funciona</h2>
                    <ul className="post-list">
                      {post.highlights.map((item, idx) => (
                        <li key={idx} className="post-list-item">{item}</li>
                      ))}
                    </ul>
                  </>
                )}
                
                {post.lowlights && post.lowlights.length > 0 && (
                  <>
                    <h2 className="post-section-title">⚠️ O que não funciona</h2>
                    <ul className="post-list">
                      {post.lowlights.map((item, idx) => (
                        <li key={idx} className="post-list-item">{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <p className="post-paragraph">{post.excerpt}</p>
            )}
          </div>
        </div>
      </article>

      {/* Sistema de Comentários */}
      <Comments postId={post.id} darkMode={darkMode} />
    </div>
  );
};

export default PostDetail;