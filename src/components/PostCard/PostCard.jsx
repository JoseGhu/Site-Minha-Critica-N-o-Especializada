import React from 'react';
import { Star, Calendar, Clock } from 'lucide-react';
import { colors } from '../../styles/colors';
import './PostCard.css';

const PostCard = ({ post, onClick }) => {
  return (
    <article 
      onClick={onClick} 
      className="post-card"
    >
      <div className="post-image-container">
        <img 
          src={post.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'} 
          alt={post.title} 
          className="post-image"
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
          {post.readTime && (
            <span className="post-read-time">
              <Clock size={14} />
              {post.readTime}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;