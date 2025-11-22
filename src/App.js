import React, { useState, useEffect } from 'react';
import { Film, Tv, Newspaper, Mail, Home, Star, Calendar, Clock, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Save, X, Lock, LogOut } from 'lucide-react';

// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================
const API_URL = 'http://localhost:3001/api';

// Funções da API
const api = {
  async getPosts() {
    const res = await fetch(`${API_URL}/posts`);
    if (!res.ok) throw new Error('Erro ao buscar posts');
    return res.json();
  },
  async login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Usuário ou senha inválidos');
    return res.json();
  },
  async createPost(token, data) {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao criar post');
    return res.json();
  },
  async updatePost(token, id, data) {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Erro ao atualizar post');
    return res.json();
  },
  async deletePost(token, id) {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Erro ao deletar post');
    return res.json();
  }
};

// Paleta de cores extraída do logo
const colors = {
  primary: '#D32F2F',
  secondary: '#FFA726',
  accent: '#4DB6AC',
  dark: '#1A1A2E',
  cream: '#FFF8DC',
  gold: '#FFD700',
};

// Dados do banner
const bannerSlides = [
  { id: 1, image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&q=80", title: "As Melhores Críticas de Cinema", subtitle: "Análises sinceras sem complicação" },
  { id: 2, image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80", title: "Séries Imperdíveis da Temporada", subtitle: "Descubra suas próximas maratonas" },
  { id: 3, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80", title: "Notícias Quentes do Mundo do Entretenimento", subtitle: "Fique por dentro das novidades" }
];

// ==========================================
// COMPONENTE BANNER
// ==========================================
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '15px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
      {bannerSlides.map((slide, index) => (
        <div key={slide.id} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          opacity: index === currentSlide ? 1 : 0, transition: 'opacity 0.8s ease-in-out',
          background: `linear-gradient(135deg, rgba(26,26,46,0.7) 0%, rgba(211,47,47,0.5) 100%), url(${slide.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', padding: '0 4rem'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '1rem', textShadow: '2px 2px 8px rgba(0,0,0,0.7)', lineHeight: '1.1' }}>{slide.title}</h2>
            <p style={{ fontSize: '1.5rem', color: colors.secondary, fontWeight: '600', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>{slide.subtitle}</p>
          </div>
        </div>
      ))}
      <button onClick={prevSlide} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}><ChevronLeft size={24} /></button>
      <button onClick={nextSlide} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}><ChevronRight size={24} /></button>
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
        {bannerSlides.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} style={{ width: '12px', height: '12px', borderRadius: '50%', border: 'none', background: index === currentSlide ? colors.secondary : 'rgba(255,255,255,0.5)', cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE HEADER - COM ACESSO SECRETO AO ADMIN
// ==========================================
const Header = ({ currentPage, setCurrentPage, onLogoDoubleClick }) => (
  <header style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.dark} 100%)`, padding: '1.5rem 0', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100, overflow: 'visible' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* LOGO - CLIQUE DUPLO PARA ACESSAR ADMIN (SECRETO!) */}
        <div 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
          onClick={() => setCurrentPage('home')}
          onDoubleClick={onLogoDoubleClick}
          title="Clique para ir ao início"
        >
          <img 
            src="/images/logo-minha-critica.png" 
            alt="Minha Crítica Não Especializada" 
            style={{ height: '150px', width: 'auto', marginTop: '-20px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))', transition: 'transform 0.3s ease' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>
        {/* MENU - SEM BOTÃO ADMIN VISÍVEL */}
        <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { name: 'Início', icon: Home, page: 'home' },
            { name: 'Críticas', icon: Film, page: 'críticas' },
            { name: 'Séries', icon: Tv, page: 'séries' },
            { name: 'Notícias', icon: Newspaper, page: 'notícias' },
            { name: 'Contato', icon: Mail, page: 'contato' }
          ].map(item => (
            <button key={item.page} onClick={() => setCurrentPage(item.page)} style={{
              background: currentPage === item.page ? colors.secondary : 'transparent',
              color: colors.cream, border: `2px solid ${currentPage === item.page ? colors.secondary : 'transparent'}`,
              padding: '0.6rem 1.2rem', borderRadius: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.95rem', fontWeight: '700', transition: 'all 0.3s ease', textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              <item.icon size={18} /> {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  </header>
);

// ==========================================
// COMPONENTE POST CARD
// ==========================================
const PostCard = ({ post, onClick }) => (
  <article onClick={onClick} style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.12)', cursor: 'pointer', transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column' }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(211, 47, 47, 0.25)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'; }}>
    <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
      <img src={post.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'} alt={post.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: colors.primary, color: 'white', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>{post.type}</div>
      {post.rating && <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: colors.gold, color: colors.dark, padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={14} fill="currentColor" />{post.rating}</div>}
    </div>
    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: colors.dark, marginBottom: '0.8rem', lineHeight: '1.3' }}>{post.title}</h3>
      <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1rem', flex: 1 }}>{post.excerpt}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: `1px solid ${colors.cream}`, fontSize: '0.85rem', color: '#999' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} />{new Date(post.date).toLocaleDateString('pt-BR')}</span>
        {post.readTime && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} />{post.readTime}</span>}
      </div>
    </div>
  </article>
);

// ==========================================
// COMPONENTE POST DETAIL
// ==========================================
const PostDetail = ({ post, onBack }) => (
  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
    <button onClick={onBack} style={{ background: colors.accent, color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '25px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', marginBottom: '2rem' }}>← Voltar</button>
    <article style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
      <div style={{ position: 'relative', paddingTop: '50%' }}>
        <img src={post.image} alt={post.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ background: colors.primary, color: 'white', padding: '0.5rem 1.2rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '700' }}>{post.type}</span>
          {post.rating && <span style={{ background: colors.gold, color: colors.dark, padding: '0.5rem 1.2rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Star size={16} fill="currentColor" />{post.rating} / 5</span>}
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: colors.dark, marginBottom: '1rem', lineHeight: '1.2' }}>{post.title}</h1>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', fontSize: '0.95rem', color: '#666' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} />{new Date(post.date).toLocaleDateString('pt-BR')}</span>
          {post.readTime && <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} />{post.readTime}</span>}
        </div>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
          {post.fullContent ? (
            <>
              {post.fullContent.split('\n\n').map((paragraph, idx) => (<p key={idx} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>))}
              {post.highlights && post.highlights.length > 0 && (
                <>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.primary, marginTop: '2.5rem', marginBottom: '1rem' }}>✅ O que funciona</h2>
                  <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>{post.highlights.map((item, idx) => (<li key={idx} style={{ marginBottom: '0.8rem', color: '#333' }}>{item}</li>))}</ul>
                </>
              )}
              {post.lowlights && post.lowlights.length > 0 && (
                <>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.primary, marginTop: '2rem', marginBottom: '1rem' }}>⚠️ O que não funciona</h2>
                  <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>{post.lowlights.map((item, idx) => (<li key={idx} style={{ marginBottom: '0.8rem', color: '#333' }}>{item}</li>))}</ul>
                </>
              )}
            </>
          ) : (<p style={{ marginBottom: '1.5rem' }}>{post.excerpt}</p>)}
        </div>
      </div>
    </article>
  </div>
);

// ==========================================
// COMPONENTE FOOTER
// ==========================================
const Footer = () => (
  <footer style={{ background: colors.dark, color: colors.cream, padding: '3rem 2rem', marginTop: '4rem' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <img src="/images/logo-minha-critica.png" alt="Minha Crítica Não Especializada" style={{ height: '100px', width: 'auto', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 12px rgba(255,167,38,0.4))' }} />
      <p style={{ marginBottom: '1.5rem', color: colors.accent }}>Opiniões sinceras sobre cinema e séries, sem frescura.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <a href="https://www.instagram.com/minhacriticanaoespecializada/" target="_blank" rel="noopener noreferrer" style={{ color: colors.secondary, textDecoration: 'none', fontWeight: '700' }}>Instagram</a>
      </div>
      <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>© 2025 Minha Crítica Não Especializada. Todos os direitos reservados.</p>
    </div>
  </footer>
);

// ==========================================
// COMPONENTE ADMIN PANEL (SECRETO!)
// ==========================================
const AdminPanel = ({ onClose, onPostChange }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'críticas', type: 'Filme', image: '', excerpt: '', rating: '', readTime: '', fullContent: '', highlights: '', lowlights: '' });

  useEffect(() => { if (isLoggedIn) loadPosts(); }, [isLoggedIn]);

  const loadPosts = async () => {
    try { const data = await api.getPosts(); setPosts(data); } catch (e) { console.error(e); }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await api.login(username, password);
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      setUsername(''); setPassword('');
    } catch (e) { alert('❌ ' + e.message); } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('admin_token'); setToken(''); setIsLoggedIn(false); };

  const handleSave = async () => {
    if (!form.title || !form.excerpt) { alert('Preencha título e resumo!'); return; }
    try {
      setLoading(true);
      const postData = {
        ...form, rating: form.rating ? parseFloat(form.rating) : null,
        date: editing?.date || new Date().toISOString().split('T')[0],
        highlights: form.highlights ? form.highlights.split('\n').filter(h => h.trim()) : [],
        lowlights: form.lowlights ? form.lowlights.split('\n').filter(l => l.trim()) : []
      };
      if (editing) { await api.updatePost(token, editing.id, postData); alert('✅ Post atualizado!'); }
      else { await api.createPost(token, postData); alert('✅ Post criado!'); }
      setForm({ title: '', category: 'críticas', type: 'Filme', image: '', excerpt: '', rating: '', readTime: '', fullContent: '', highlights: '', lowlights: '' });
      setEditing(null); loadPosts(); if (onPostChange) onPostChange();
    } catch (e) { alert('❌ ' + e.message); } finally { setLoading(false); }
  };

  const handleEdit = (post) => {
    setEditing(post);
    setForm({ title: post.title || '', category: post.category || 'críticas', type: post.type || 'Filme', image: post.image || '', excerpt: post.excerpt || '', rating: post.rating || '', readTime: post.readTime || '', fullContent: post.fullContent || '', highlights: post.highlights?.join('\n') || '', lowlights: post.lowlights?.join('\n') || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deletar este post?')) return;
    try { await api.deletePost(token, id); alert('✅ Post deletado!'); loadPosts(); if (onPostChange) onPostChange(); } catch (e) { alert('❌ ' + e.message); }
  };

  const inputStyle = { width: '100%', padding: '0.8rem', border: `2px solid ${colors.cream}`, borderRadius: '8px', fontSize: '1rem', marginBottom: '1rem' };

  // TELA DE LOGIN
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: colors.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Lock size={48} color={colors.primary} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: colors.dark, marginTop: '1rem' }}>Painel Admin</h1>
            <p style={{ color: '#666' }}>Minha Crítica Não Especializada</p>
          </div>
          <input type="text" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleLogin()} style={inputStyle} />
          <button onClick={handleLogin} disabled={loading} style={{ width: '100%', background: colors.primary, color: 'white', border: 'none', padding: '1rem', borderRadius: '10px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', marginBottom: '1rem' }}>{loading ? '⏳ Entrando...' : '🔐 Entrar'}</button>
          <button onClick={onClose} style={{ width: '100%', background: '#999', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer' }}>← Voltar ao Blog</button>
          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>Usuário: admin | Senha: admin123</p>
        </div>
      </div>
    );
  }

  // PAINEL ADMIN
  return (
    <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
      <header style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.dark} 100%)`, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '900' }}>🎬 Painel Admin</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={onClose} style={{ background: colors.accent, color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>← Blog</button>
          <button onClick={handleLogout} style={{ background: colors.secondary, color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><LogOut size={16} />Sair</button>
        </div>
      </header>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* FORMULÁRIO */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.dark, marginBottom: '1.5rem' }}>{editing ? '✏️ Editar Post' : '➕ Novo Post'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <input type="text" placeholder="Título *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              <option value="críticas">Críticas</option><option value="séries">Séries</option><option value="notícias">Notícias</option>
            </select>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
              <option value="Filme">Filme</option><option value="Série">Série</option><option value="Documentário">Documentário</option><option value="Notícia">Notícia</option>
            </select>
            <input type="text" placeholder="URL da Imagem" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} style={inputStyle} />
            <input type="number" placeholder="Nota (0-5)" min="0" max="5" step="0.5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} style={inputStyle} />
            <input type="text" placeholder="Tempo de leitura (ex: 5 min)" value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} style={inputStyle} />
          </div>
          <textarea placeholder="Resumo *" rows="3" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
          <textarea placeholder="Conteúdo completo (separe parágrafos com linha em branco)" rows="8" value={form.fullContent} onChange={e => setForm({ ...form, fullContent: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <textarea placeholder="✅ Pontos positivos (um por linha)" rows="4" value={form.highlights} onChange={e => setForm({ ...form, highlights: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
            <textarea placeholder="⚠️ Pontos negativos (um por linha)" rows="4" value={form.lowlights} onChange={e => setForm({ ...form, lowlights: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={handleSave} disabled={loading} style={{ background: colors.primary, color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Save size={18} /> {loading ? 'Salvando...' : editing ? 'Atualizar' : 'Criar Post'}</button>
            {editing && <button onClick={() => { setEditing(null); setForm({ title: '', category: 'críticas', type: 'Filme', image: '', excerpt: '', rating: '', readTime: '', fullContent: '', highlights: '', lowlights: '' }); }} style={{ background: '#999', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><X size={18} /> Cancelar</button>}
          </div>
        </div>
        {/* LISTA DE POSTS */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.dark, marginBottom: '1.5rem' }}>📋 Posts Cadastrados ({posts.length})</h2>
          {posts.length === 0 ? (<p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>Nenhum post cadastrado ainda.</p>) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {posts.map(post => (
                <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: colors.cream, borderRadius: '10px', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ background: colors.primary, color: 'white', padding: '0.2rem 0.6rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700' }}>{post.type}</span>
                      {post.rating && <span style={{ background: colors.gold, color: colors.dark, padding: '0.2rem 0.6rem', borderRadius: '5px', fontSize: '0.75rem', fontWeight: '700' }}>⭐ {post.rating}</span>}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.dark, marginBottom: '0.3rem' }}>{post.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>{post.excerpt?.substring(0, 80)}...</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(post)} style={{ background: colors.accent, color: 'white', border: 'none', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer' }}><Edit size={18} /></button>
                    <button onClick={() => handleDelete(post.id)} style={{ background: colors.primary, color: 'white', border: 'none', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={18} /></button>
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

// ==========================================
// COMPONENTE PRINCIPAL - APP
// ==========================================
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  useEffect(() => { if (!selectedPost && currentPage !== 'contato' && !showAdmin) { loadPosts(); } }, [currentPage]);

  const loadPosts = async () => {
    try {
      setLoading(true); setError(null);
      console.log('🔄 Carregando posts do MySQL...');
      const data = await api.getPosts();
      console.log(`✅ ${data.length} posts carregados do MySQL!`);
      setPosts(data);
    } catch (err) {
      console.error('❌ Erro ao carregar posts do MySQL:', err);
      setError('Erro ao conectar com o servidor. Usando dados locais.');
      const localPosts = localStorage.getItem('minha-critica-posts');
      if (localPosts) { setPosts(JSON.parse(localPosts)); } else { setPosts([]); }
    } finally { setLoading(false); }
  };

  const filteredPosts = currentPage === 'home' ? posts : posts.filter(post => post.category === currentPage);

  // ADMIN PANEL (SECRETO - acesso via clique duplo no logo)
  if (showAdmin) {
    return <AdminPanel onClose={() => { setShowAdmin(false); loadPosts(); }} onPostChange={loadPosts} />;
  }

  // POST INDIVIDUAL
  if (selectedPost) {
    return (
      <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} onLogoDoubleClick={() => setShowAdmin(true)} />
        <main style={{ padding: '3rem 2rem' }}><PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} /></main>
        <Footer />
      </div>
    );
  }

  // CONTATO
  if (currentPage === 'contato') {
    return (
      <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} onLogoDoubleClick={() => setShowAdmin(true)} />
        <main style={{ padding: '3rem 2rem' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: colors.dark, marginBottom: '1rem' }}>Entre em Contato</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>Tem uma sugestão? Quer colaborar? Mande sua mensagem!</p>
            <input type="text" placeholder="Seu nome" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: `2px solid ${colors.cream}`, borderRadius: '10px', fontSize: '1rem' }} />
            <input type="email" placeholder="Seu e-mail" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: `2px solid ${colors.cream}`, borderRadius: '10px', fontSize: '1rem' }} />
            <textarea placeholder="Sua mensagem" rows="6" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', border: `2px solid ${colors.cream}`, borderRadius: '10px', fontSize: '1rem', fontFamily: 'inherit' }} />
            <button style={{ background: colors.primary, color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '25px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', width: '100%' }}>Enviar Mensagem</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>🎬</div>
        <h2 style={{ color: colors.dark, fontSize: '1.5rem' }}>Carregando posts...</h2>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // PÁGINA PRINCIPAL
  return (
    <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} onLogoDoubleClick={() => setShowAdmin(true)} />
      <main style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {currentPage === 'home' && <Banner />}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: colors.dark, textTransform: 'capitalize' }}>{currentPage === 'home' ? 'Últimas Publicações' : currentPage}</h2>
            <span style={{ background: error ? colors.secondary : colors.accent, color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{error ? '📦 localStorage (Backup)' : '🗄️ MySQL Conectado'} • {filteredPosts.length} posts</span>
          </div>
          {filteredPosts.length === 0 ? (
            <div style={{ background: 'white', padding: '3rem', borderRadius: '20px', textAlign: 'center', color: '#999', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>📭 Nenhum post encontrado</p>
              <p style={{ fontSize: '1rem' }}>{error ? 'Verifique se o backend está rodando em http://localhost:3001' : 'Não há posts nesta categoria ainda.'}</p>
              {error && <button onClick={loadPosts} style={{ marginTop: '1.5rem', background: colors.primary, color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>🔄 Tentar Reconectar</button>}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {filteredPosts.map(post => (<PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}