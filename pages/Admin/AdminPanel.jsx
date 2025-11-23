import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Save, X, Lock, LogOut } from 'lucide-react';
import { api } from '../../services/api';
import { colors } from '../../styles/colors';
import './AdminPanel.css';

const AdminPanel = ({ onClose, onPostChange }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    title: '', 
    category: 'críticas', 
    type: 'Filme', 
    image: '', 
    excerpt: '', 
    rating: '', 
    readTime: '', 
    fullContent: '', 
    highlights: '', 
    lowlights: '' 
  });

  useEffect(() => { 
    if (isLoggedIn) loadPosts(); 
  }, [isLoggedIn]);

  const loadPosts = async () => {
    try { 
      const data = await api.getPosts(); 
      setPosts(data); 
    } catch (e) { 
      console.error(e); 
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await api.login(username, password);
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      setUsername(''); 
      setPassword('');
    } catch (e) { 
      alert('❌ ' + e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleLogout = () => { 
    localStorage.removeItem('admin_token'); 
    setToken(''); 
    setIsLoggedIn(false); 
  };

  const handleSave = async () => {
    if (!form.title || !form.excerpt) { 
      alert('Preencha título e resumo!'); 
      return; 
    }
    try {
      setLoading(true);
      const postData = {
        ...form, 
        rating: form.rating ? parseFloat(form.rating) : null,
        date: editing?.date || new Date().toISOString().split('T')[0],
        highlights: form.highlights ? form.highlights.split('\n').filter(h => h.trim()) : [],
        lowlights: form.lowlights ? form.lowlights.split('\n').filter(l => l.trim()) : []
      };
      if (editing) { 
        await api.updatePost(token, editing.id, postData); 
        alert('✅ Post atualizado!'); 
      } else { 
        await api.createPost(token, postData); 
        alert('✅ Post criado!'); 
      }
      setForm({ 
        title: '', 
        category: 'críticas', 
        type: 'Filme', 
        image: '', 
        excerpt: '', 
        rating: '', 
        readTime: '', 
        fullContent: '', 
        highlights: '', 
        lowlights: '' 
      });
      setEditing(null); 
      loadPosts(); 
      if (onPostChange) onPostChange();
    } catch (e) { 
      alert('❌ ' + e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleEdit = (post) => {
    setEditing(post);
    setForm({ 
      title: post.title || '', 
      category: post.category || 'críticas', 
      type: post.type || 'Filme', 
      image: post.image || '', 
      excerpt: post.excerpt || '', 
      rating: post.rating || '', 
      readTime: post.readTime || '', 
      fullContent: post.fullContent || '', 
      highlights: post.highlights?.join('\n') || '', 
      lowlights: post.lowlights?.join('\n') || '' 
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deletar este post?')) return;
    try { 
      await api.deletePost(token, id); 
      alert('✅ Post deletado!'); 
      loadPosts(); 
      if (onPostChange) onPostChange(); 
    } catch (e) { 
      alert('❌ ' + e.message); 
    }
  };

  const inputStyle = { 
    width: '100%', 
    padding: '0.8rem', 
    border: `2px solid ${colors.cream}`, 
    borderRadius: '8px', 
    fontSize: '1rem', 
    marginBottom: '1rem' 
  };

  // TELA DE LOGIN
  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-form">
          <div className="login-header">
            <Lock size={48} color={colors.primary} />
            <h1>Painel Admin</h1>
            <p>Minha Crítica Não Especializada</p>
          </div>
          <input 
            type="text" 
            placeholder="Usuário" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            style={inputStyle} 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()} 
            style={inputStyle} 
          />
          <button 
            onClick={handleLogin} 
            disabled={loading} 
            className="login-button"
          >
            {loading ? '⏳ Entrando...' : '🔐 Entrar'}
          </button>
          <button 
            onClick={onClose} 
            className="back-button"
          >
            ← Voltar ao Blog
          </button>
          <p className="login-hint">
            Usuário: admin | Senha: admin123
          </p>
        </div>
      </div>
    );
  }

  // PAINEL ADMIN
  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>🎬 Painel Admin</h1>
        <div className="admin-actions">
          <button onClick={onClose} className="admin-button secondary">
            ← Blog
          </button>
          <button onClick={handleLogout} className="admin-button warning">
            <LogOut size={16} />Sair
          </button>
        </div>
      </header>
      
      <main className="admin-main">
        {/* FORMULÁRIO */}
        <div className="admin-form-section">
          <h2>{editing ? '✏️ Editar Post' : '➕ Novo Post'}</h2>
          <div className="form-grid">
            <input 
              type="text" 
              placeholder="Título *" 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })} 
              style={inputStyle} 
            />
            <select 
              value={form.category} 
              onChange={e => setForm({ ...form, category: e.target.value })} 
              style={inputStyle}
            >
              <option value="críticas">Críticas</option>
              <option value="séries">Séries</option>
              <option value="notícias">Notícias</option>
            </select>
            <select 
              value={form.type} 
              onChange={e => setForm({ ...form, type: e.target.value })} 
              style={inputStyle}
            >
              <option value="Filme">Filme</option>
              <option value="Série">Série</option>
              <option value="Documentário">Documentário</option>
              <option value="Notícia">Notícia</option>
            </select>
            <input 
              type="text" 
              placeholder="URL da Imagem" 
              value={form.image} 
              onChange={e => setForm({ ...form, image: e.target.value })} 
              style={inputStyle} 
            />
            <input 
              type="number" 
              placeholder="Nota (0-5)" 
              min="0" 
              max="5" 
              step="0.5" 
              value={form.rating} 
              onChange={e => setForm({ ...form, rating: e.target.value })} 
              style={inputStyle} 
            />
            <input 
              type="text" 
              placeholder="Tempo de leitura (ex: 5 min)" 
              value={form.readTime} 
              onChange={e => setForm({ ...form, readTime: e.target.value })} 
              style={inputStyle} 
            />
          </div>
          
          <textarea 
            placeholder="Resumo *" 
            rows="3" 
            value={form.excerpt} 
            onChange={e => setForm({ ...form, excerpt: e.target.value })} 
            style={{ ...inputStyle, resize: 'vertical' }} 
          />
          
          <textarea 
            placeholder="Conteúdo completo (separe parágrafos com linha em branco)" 
            rows="8" 
            value={form.fullContent} 
            onChange={e => setForm({ ...form, fullContent: e.target.value })} 
            style={{ ...inputStyle, resize: 'vertical' }} 
          />
          
          <div className="highlights-grid">
            <textarea 
              placeholder="✅ Pontos positivos (um por linha)" 
              rows="4" 
              value={form.highlights} 
              onChange={e => setForm({ ...form, highlights: e.target.value })} 
              style={{ ...inputStyle, resize: 'vertical' }} 
            />
            <textarea 
              placeholder="⚠️ Pontos negativos (um por linha)" 
              rows="4" 
              value={form.lowlights} 
              onChange={e => setForm({ ...form, lowlights: e.target.value })} 
              style={{ ...inputStyle, resize: 'vertical' }} 
            />
          </div>
          
          <div className="form-actions">
            <button 
              onClick={handleSave} 
              disabled={loading} 
              className="save-button"
            >
              <Save size={18} /> 
              {loading ? 'Salvando...' : editing ? 'Atualizar' : 'Criar Post'}
            </button>
            
            {editing && (
              <button 
                onClick={() => { 
                  setEditing(null); 
                  setForm({ 
                    title: '', 
                    category: 'críticas', 
                    type: 'Filme', 
                    image: '', 
                    excerpt: '', 
                    rating: '', 
                    readTime: '', 
                    fullContent: '', 
                    highlights: '', 
                    lowlights: '' 
                  }); 
                }} 
                className="cancel-button"
              >
                <X size={18} /> Cancelar
              </button>
            )}
          </div>
        </div>

        {/* LISTA DE POSTS */}
        <div className="posts-list-section">
          <h2>📋 Posts Cadastrados ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="no-posts">Nenhum post cadastrado ainda.</p>
          ) : (
            <div className="posts-list">
              {posts.map(post => (
                <div key={post.id} className="post-item">
                  <div className="post-info">
                    <div className="post-badges">
                      <span className="type-badge">{post.type}</span>
                      {post.rating && (
                        <span className="rating-badge">
                          ⭐ {post.rating}
                        </span>
                      )}
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt?.substring(0, 80)}...</p>
                  </div>
                  <div className="post-actions">
                    <button 
                      onClick={() => handleEdit(post)} 
                      className="edit-button"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)} 
                      className="delete-button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Exportação padrão CORRETA
export default AdminPanel;