import React from 'react';
import { Star, Calendar, Clock } from 'lucide-react';
import { colors } from '../../styles/colors';
import './PostDetail.css';

const PostDetail = ({ post, onBack }) => {
  return (
    <div className="post-detail-container">
      <button onClick={onBack} className="back-button">
        ← Voltar
      </button>
      
      <article className="post-detail">
        <div className="post-detail-image-container">
          <img src={post.image} alt={post.title} className="post-detail-image" />
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
            {post.readTime && (
              <span className="post-detail-read-time">
                <Clock size={16} />
                {post.readTime}
              </span>
            )}
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
    </div>
  );
};

export default PostDetail;