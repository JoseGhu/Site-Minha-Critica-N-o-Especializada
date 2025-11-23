import React from 'react';
import { Star, Calendar, Clock, Eye } from 'lucide-react';
import './PostCard.css';

const PostCard = ({ post, onClick, darkMode }) => {
  const handleClick = () => {
    // Rastrear visualização
    const views = JSON.parse(localStorage.getItem('post-views') || '{}');
    views[post.id] = (views[post.id] || 0) + 1;
    localStorage.setItem('post-views', JSON.stringify(views));
    
    onClick();
  };

  const views = JSON.parse(localStorage.getItem('post-views') || '{}')[post.id] || 0;

  return (
    <article 
      onClick={handleClick} 
      className={`post-card ${darkMode ? 'dark' : ''}`}
    >
      <div className="post-image-container">
        <img 
          src={post.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'} 
          alt={post.title} 
          className="post-image"
          loading="lazy"
        />
        <div className="post-type-badge">{post.type}</div>
        {post.rating && (
          <div className="post-rating-badge">
            <Star size={14} fill="currentColor" />
            {post.rating}
          </div>
        )}
      </div>
      
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>
        
        <div className="post-meta">
          <span className="post-date">
            <Calendar size={14} />
            {new Date(post.date).toLocaleDateString('pt-BR')}
          </span>
          
          <div className="post-stats">
            {post.readTime && (
              <span className="post-read-time">
                <Clock size={14} />
                {post.readTime}
              </span>
            )}
            
            {views > 0 && (
              <span className="post-views">
                <Eye size={14} />
                {views}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;