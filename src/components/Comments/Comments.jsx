import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, Calendar, ThumbsUp } from 'lucide-react';
import './Comments.css';

const Comments = ({ postId, darkMode }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  // Carregar comentários
  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]');
    setComments(savedComments.filter(comment => comment.approved));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) {
      alert('Por favor, preencha seu nome e comentário!');
      return;
    }

    setLoading(true);
    
    const comment = {
      id: Date.now(),
      postId,
      author: author.trim(),
      content: newComment.trim(),
      date: new Date().toISOString(),
      approved: true, // Em produção, definir como false para moderação
      likes: 0
    };

    try {
      // Salvar no localStorage
      const existingComments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]');
      const updatedComments = [...existingComments, comment];
      localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments));
      
      setComments(updatedComments.filter(c => c.approved));
      setNewComment('');
      setAuthor('');
    } catch (error) {
      console.error('Erro ao salvar comentário:', error);
      alert('Erro ao enviar comentário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (commentId) => {
    const updatedComments = comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: (comment.likes || 0) + 1 }
        : comment
    );
    
    // Atualizar localStorage
    const allComments = JSON.parse(localStorage.getItem(`comments-${postId}`) || '[]');
    const updatedAllComments = allComments.map(comment =>
      comment.id === commentId
        ? { ...comment, likes: (comment.likes || 0) + 1 }
        : comment
    );
    
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedAllComments));
    setComments(updatedComments);
  };

  return (
    <div className={`comments-section ${darkMode ? 'dark' : ''}`}>
      <h3 className="comments-title">
        <MessageCircle size={24} />
        Comentários ({comments.length})
      </h3>

      {/* Formulário de comentário */}
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Seu nome *"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="comment-input"
            required
            maxLength={50}
          />
        </div>
        
        <div className="form-row">
          <textarea
            placeholder="Deixe seu comentário... *"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-textarea"
            rows="4"
            required
            maxLength={500}
          />
          <div className="char-count">{newComment.length}/500</div>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || !newComment.trim() || !author.trim()}
        >
          {loading ? (
            'Enviando...'
          ) : (
            <>
              <Send size={16} />
              Enviar Comentário
            </>
          )}
        </button>
      </form>

      {/* Lista de comentários */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <MessageCircle size={48} />
            <p>Seja o primeiro a comentar!</p>
            <small>Compartilhe sua opinião sobre esta crítica</small>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-author">
                  <User size={16} />
                  <strong>{comment.author}</strong>
                </div>
                <div className="comment-date">
                  <Calendar size={14} />
                  {new Date(comment.date).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(comment.date).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              <div className="comment-content">
                {comment.content}
              </div>
              
              <div className="comment-actions">
                <button 
                  onClick={() => handleLike(comment.id)}
                  className="like-button"
                  title="Curtir comentário"
                >
                  <ThumbsUp size={14} />
                  {comment.likes || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;