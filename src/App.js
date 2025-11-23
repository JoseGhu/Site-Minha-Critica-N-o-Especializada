import React, { useState, useEffect } from 'react';

// Configuração da API - Conectando com seu backend
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001/api' 
  : 'https://seu-backend.railway.app/api';

// Funções da API otimizadas para MySQL
const api = {
  async getPosts() {
    try {
      console.log('🌐 Conectando com a API MySQL...');
      const res = await fetch(`${API_URL}/posts`);
      if (!res.ok) throw new Error('Erro ao buscar posts');
      const data = await res.json();
      
      // Salva no localStorage como backup
      localStorage.setItem('minha-critica-posts', JSON.stringify(data));
      console.log('✅ Posts carregados do MySQL!');
      return data;
    } catch (error) {
      console.log('❌ Erro na API, usando fallback localStorage...');
      // Fallback para localStorage
      const localPosts = localStorage.getItem('minha-critica-posts');
      if (localPosts && JSON.parse(localPosts).length > 0) {
        return JSON.parse(localPosts);
      }
      throw new Error('Não foi possível carregar os posts');
    }
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

  async createPost(postData, token) {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error('Erro ao criar post');
    return res.json();
  },

  async updatePost(postId, postData, token) {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error('Erro ao atualizar post');
    return res.json();
  },

  async deletePost(postId, token) {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Erro ao excluir post');
    return res.json();
  }
};

function App() {
  // Estados principais
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({ name: '', email: '', text: '' });

  // Carregar posts e comentários
  useEffect(() => {
    loadPosts();
    loadComments();
    loadNewsletterSubscribers();
    
    // Mostrar newsletter popup após 5 segundos
    const timer = setTimeout(() => {
      const hasSubscribed = localStorage.getItem('newsletter-subscribed');
      if (!hasSubscribed) {
        setShowNewsletter(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPosts();
      setPosts(data);
    } catch (err) {
      const localPosts = localStorage.getItem('minha-critica-posts');
      if (localPosts && JSON.parse(localPosts).length > 0) {
        setPosts(JSON.parse(localPosts));
        setError('Modo offline - posts carregados do cache local');
      } else {
        setError('Não foi possível conectar com o servidor. Use o painel admin para criar seus primeiros posts.');
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadComments = () => {
    const savedComments = localStorage.getItem('minha-critica-comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  };

  const loadNewsletterSubscribers = () => {
    const subscribers = localStorage.getItem('newsletter-subscribers');
    return subscribers ? JSON.parse(subscribers) : [];
  };

  // Componente SEO Head
  const SEOHead = () => {
    const currentPost = selectedPost || (posts.length > 0 ? posts[0] : null);
    
    const metaTags = {
      title: currentPost 
        ? `${currentPost.title} - Minha Crítica Não Especializada`
        : 'Minha Crítica Não Especializada - Opiniões Sinceras sobre Cinema e Séries',
      
      description: currentPost 
        ? currentPost.excerpt
        : 'Opiniões sinceras sobre cinema e séries, sem frescura. Críticas, análises e notícias do mundo do entretenimento.',
      
      keywords: currentPost
        ? `crítica, ${currentPost.type}, ${currentPost.category}, filme, série, análise`
        : 'crítica, cinema, séries, filmes, análise, entretenimento, opinião',
      
      url: window.location.href,
      image: currentPost?.image || '/images/logo-minha-critica.png'
    };

    // Em uma aplicação real, você usaria React Helmet para injetar no head
    // Por enquanto, vamos apenas retornar um div invisível com as informações
    return (
      <div style={{ display: 'none' }}>
        {/* Meta tags que seriam injetadas no head em uma aplicação real */}
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:image" content={metaTags.image} />
        <meta property="og:url" content={metaTags.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTags.title} />
        <meta name="twitter:description" content={metaTags.description} />
        <meta name="twitter:image" content={metaTags.image} />
        
        {/* Schema.org markup for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Minha Crítica Não Especializada",
            "description": metaTags.description,
            "url": metaTags.url,
            "publisher": {
              "@type": "Organization",
              "name": "Minha Crítica Não Especializada",
              "logo": {
                "@type": "ImageObject",
                "url": "/images/logo-minha-critica.png"
              }
            }
          })}
        </script>
      </div>
    );
  };

  // Banner de Slides
  const SlideshowBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
      {
        title: "🎬 Críticas Sem Frescura",
        description: "Opiniões sinceras sobre os lançamentos do cinema",
        background: "linear-gradient(135deg, #D32F2F 0%, #1A1A2E 100%)",
        emoji: "🎥"
      },
      {
        title: "📺 Séries Imperdíveis",
        description: "Análises detalhadas das melhores séries",
        background: "linear-gradient(135deg, #4DB6AC 0%, #1A1A2E 100%)",
        emoji: "📺"
      },
      {
        title: "📰 Notícias Quentes",
        description: "Fique por dentro do mundo do entretenimento",
        background: "linear-gradient(135deg, #FFA726 0%, #1A1A2E 100%)",
        emoji: "📰"
      }
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }, [slides.length]);

    if (currentPage !== 'home') return null;

    return (
      <section style={{
        height: '400px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '20px',
        marginBottom: '3rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: slide.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              padding: '2rem'
            }}
          >
            <div style={{ 
              textAlign: 'center', 
              color: 'white',
              maxWidth: '600px'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {slide.emoji}
              </div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '900',
                marginBottom: '1rem',
                textShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}>
                {slide.title}
              </h1>
              <p style={{
                fontSize: '1.3rem',
                opacity: 0.9,
                marginBottom: '2rem'
              }}>
                {slide.description}
              </p>
              <button
                onClick={() => setCurrentPage(slide.title.includes('Críticas') ? 'críticas' : 
                           slide.title.includes('Séries') ? 'séries' : 'notícias')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid white',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                }}
              >
                Explorar Agora
              </button>
            </div>
          </div>
        ))}
        
        {/* Indicadores */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem'
        }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentSlide ? '#FFA726' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>
    );
  };

  // Componente Header
  const Header = () => {
    const handleSearch = (e) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        setCurrentPage('search');
        setShowSearch(false);
      }
    };

    const menuItems = [
      { name: 'Início', page: 'home' },
      { name: 'Críticas', page: 'críticas' },
      { name: 'Séries', page: 'séries' },
      { name: 'Notícias', page: 'notícias' },
      { name: 'Contato', page: 'contato' }
    ];

    return (
      <header style={{
        background: 'linear-gradient(135deg, #D32F2F 0%, #1A1A2E 100%)',
        padding: '1rem 0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '1rem' 
          }}>
            
            {/* LOGO */}
            <div 
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => {
                setCurrentPage('home');
                setSearchTerm('');
              }}
              onDoubleClick={() => setShowAdmin(true)}
              title="Clique para início | Duplo clique para admin"
            >
              <img 
                src="/images/logo-minha-critica.png" 
                alt="Minha Crítica Não Especializada" 
                style={{ 
                  height: '120px', 
                  width: 'auto', 
                  marginTop: '-10px',
                  filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))', 
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              />
            </div>

            {/* Menu e Controles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {menuItems.map(item => (
                  <button 
                    key={item.page}
                    onClick={() => {
                      setCurrentPage(item.page);
                      setSearchTerm('');
                    }}
                    style={{
                      background: currentPage === item.page ? '#FFA726' : 'transparent',
                      color: 'white',
                      border: `2px solid ${currentPage === item.page ? '#FFA726' : 'transparent'}`,
                      padding: '0.6rem 1rem',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Botão Busca */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={() => setShowSearch(!showSearch)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    title="Buscar posts"
                  >
                    🔍
                  </button>
                  
                  {showSearch && (
                    <form 
                      onSubmit={handleSearch}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem',
                        display: 'flex',
                        background: 'white',
                        borderRadius: '25px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        minWidth: '250px'
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Buscar posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          border: 'none',
                          padding: '0.8rem 1rem',
                          fontSize: '0.9rem',
                          flex: 1,
                          outline: 'none'
                        }}
                        autoFocus
                      />
                      <button 
                        type="submit"
                        style={{
                          background: '#D32F2F',
                          border: 'none',
                          color: 'white',
                          padding: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        🔍
                      </button>
                    </form>
                  )}
                </div>

                {/* Botão Dark Mode */}
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  style={{
                    background: 'transparent',
                    border: '2px solid #FFA726',
                    color: '#FFA726',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  title={darkMode ? 'Modo claro' : 'Modo escuro'}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  };

  // Componente PostDetail com Comentários
  const PostDetail = ({ post, onClose }) => {
    if (!post) return null;

    const contentParagraphs = post.fullContent ? post.fullContent.split('\n\n') : [];
    const postComments = comments[post.id] || [];

    const handleAddComment = (e) => {
      e.preventDefault();
      if (!newComment.name || !newComment.text) {
        alert('Preencha pelo menos nome e comentário!');
        return;
      }

      const comment = {
        id: Date.now(),
        ...newComment,
        date: new Date().toISOString(),
        approved: false // Comentários aguardando moderação
      };

      const updatedComments = {
        ...comments,
        [post.id]: [...postComments, comment]
      };

      setComments(updatedComments);
      localStorage.setItem('minha-critica-comments', JSON.stringify(updatedComments));
      setNewComment({ name: '', email: '', text: '' });
      alert('Comentário enviado para moderação!');
    };

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 2000,
        overflowY: 'auto',
        padding: '2rem 1rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: darkMode ? '#1a1a2e' : 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          position: 'relative'
        }}>
          {/* Botão Fechar */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: '#D32F2F',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '3rem',
              height: '3rem',
              cursor: 'pointer',
              zIndex: 10,
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          {/* Imagem do Post */}
          <div style={{ position: 'relative', paddingTop: '50%', overflow: 'hidden' }}>
            <img 
              src={post.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'} 
              alt={post.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              padding: '2rem',
              color: 'white'
            }}>
              <div style={{
                background: '#D32F2F',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '700',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                {post.type}
              </div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                marginBottom: '0.5rem',
                lineHeight: '1.2'
              }}>
                {post.title}
              </h1>
              <div style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {post.rating && (
                  <div style={{
                    background: '#FFD700',
                    color: '#1A1A2E',
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '1rem',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    ⭐ {post.rating}/5
                  </div>
                )}
                <span style={{ opacity: 0.9 }}>📅 {new Date(post.date).toLocaleDateString('pt-BR')}</span>
                {post.readTime && <span style={{ opacity: 0.9 }}>⏱️ {post.readTime}</span>}
              </div>
            </div>
          </div>

          {/* Conteúdo do Post */}
          <div style={{ padding: '3rem' }}>
            {/* Resumo */}
            <p style={{
              fontSize: '1.2rem',
              color: darkMode ? '#cccccc' : '#666666',
              lineHeight: '1.6',
              marginBottom: '2rem',
              fontWeight: '500'
            }}>
              {post.excerpt}
            </p>

            {/* Pontos Positivos e Negativos */}
            {(post.highlights?.length > 0 || post.lowlights?.length > 0) && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                marginBottom: '3rem'
              }}>
                {post.highlights?.length > 0 && (
                  <div>
                    <h3 style={{
                      color: '#4DB6AC',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      ✅ Pontos Positivos
                    </h3>
                    <ul style={{
                      color: darkMode ? '#cccccc' : '#666666',
                      lineHeight: '1.8',
                      paddingLeft: '1.5rem'
                    }}>
                      {post.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {post.lowlights?.length > 0 && (
                  <div>
                    <h3 style={{
                      color: '#FFA726',
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      ⚠️ Pontos Negativos
                    </h3>
                    <ul style={{
                      color: darkMode ? '#cccccc' : '#666666',
                      lineHeight: '1.8',
                      paddingLeft: '1.5rem'
                    }}>
                      {post.lowlights.map((lowlight, index) => (
                        <li key={index}>{lowlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Conteúdo Completo */}
            {contentParagraphs.length > 0 && (
              <div style={{
                color: darkMode ? 'white' : '#333333',
                lineHeight: '1.8',
                fontSize: '1.1rem'
              }}>
                {contentParagraphs.map((paragraph, index) => (
                  <p key={index} style={{ marginBottom: '1.5rem' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Seção de Comentários */}
            <div style={{
              marginTop: '4rem',
              paddingTop: '2rem',
              borderTop: `2px solid ${darkMode ? '#2d2d44' : '#FFF8DC'}`
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: darkMode ? 'white' : '#1A1A2E',
                marginBottom: '2rem'
              }}>
                💬 Comentários ({postComments.length})
              </h3>

              {/* Formulário de Comentário */}
              <form onSubmit={handleAddComment} style={{
                background: darkMode ? '#2d2d44' : '#FFF8DC',
                padding: '2rem',
                borderRadius: '15px',
                marginBottom: '2rem'
              }}>
                <h4 style={{
                  color: darkMode ? 'white' : '#1A1A2E',
                  marginBottom: '1rem'
                }}>
                  Deixe seu comentário
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Seu nome *"
                    value={newComment.name}
                    onChange={e => setNewComment({...newComment, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
                      borderRadius: '8px',
                      background: darkMode ? '#1a1a2e' : 'white',
                      color: darkMode ? 'white' : '#333'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Seu email"
                    value={newComment.email}
                    onChange={e => setNewComment({...newComment, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
                      borderRadius: '8px',
                      background: darkMode ? '#1a1a2e' : 'white',
                      color: darkMode ? 'white' : '#333'
                    }}
                  />
                </div>
                <textarea
                  placeholder="Seu comentário *"
                  rows="4"
                  value={newComment.text}
                  onChange={e => setNewComment({...newComment, text: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: `1px solid ${darkMode ? '#444' : '#ddd'}`,
                    borderRadius: '8px',
                    background: darkMode ? '#1a1a2e' : 'white',
                    color: darkMode ? 'white' : '#333',
                    marginBottom: '1rem',
                    resize: 'vertical'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#D32F2F',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 2rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Enviar Comentário
                </button>
              </form>

              {/* Lista de Comentários */}
              {postComments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {postComments.map(comment => (
                    <div key={comment.id} style={{
                      background: darkMode ? '#2d2d44' : '#FFF8DC',
                      padding: '1.5rem',
                      borderRadius: '10px',
                      borderLeft: `4px solid ${comment.approved ? '#4DB6AC' : '#FFA726'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <strong style={{ color: darkMode ? 'white' : '#1A1A2E' }}>
                          {comment.name}
                        </strong>
                        <small style={{ color: darkMode ? '#999' : '#666' }}>
                          {new Date(comment.date).toLocaleDateString('pt-BR')}
                          {!comment.approved && ' ⏳ (Aguardando moderação)'}
                        </small>
                      </div>
                      <p style={{ 
                        color: darkMode ? '#cccccc' : '#666666',
                        lineHeight: '1.6',
                        margin: 0
                      }}>
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ 
                  color: darkMode ? '#999' : '#666', 
                  textAlign: 'center', 
                  padding: '2rem',
                  fontStyle: 'italic'
                }}>
                  Seja o primeiro a comentar!
                </p>
              )}
            </div>

            {/* Rodapé do Post */}
            <div style={{
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: `2px solid ${darkMode ? '#2d2d44' : '#FFF8DC'}`,
              textAlign: 'center',
              color: darkMode ? '#999999' : '#888888'
            }}>
              <p>🎬 Obrigado por ler esta crítica! 🎬</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente Newsletter
  const NewsletterPopup = () => {
    const handleSubscribe = (e) => {
      e.preventDefault();
      if (!newsletterEmail) {
        alert('Por favor, digite seu email!');
        return;
      }

      const subscribers = loadNewsletterSubscribers();
      const updatedSubscribers = [...subscribers, {
        email: newsletterEmail,
        date: new Date().toISOString(),
        active: true
      }];

      localStorage.setItem('newsletter-subscribers', JSON.stringify(updatedSubscribers));
      localStorage.setItem('newsletter-subscribed', 'true');
      
      setNewsletterEmail('');
      setShowNewsletter(false);
      alert('🎉 Obrigado por se inscrever! Você receberá nossas novidades em breve.');
    };

    if (!showNewsletter) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          background: darkMode ? '#1a1a2e' : 'white',
          padding: '3rem',
          borderRadius: '20px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          position: 'relative'
        }}>
          <button 
            onClick={() => setShowNewsletter(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: darkMode ? '#999' : '#666'
            }}
          >
            ✕
          </button>

          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '900',
            color: darkMode ? 'white' : '#1A1A2E',
            marginBottom: '1rem'
          }}>
            Fique por dentro!
          </h2>
          <p style={{
            color: darkMode ? '#cccccc' : '#666666',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Receba as melhores críticas, novidades e dicas de séries e filmes diretamente no seu email.
          </p>

          <form onSubmit={handleSubscribe} style={{ marginBottom: '1.5rem' }}>
            <input
              type="email"
              placeholder="Seu melhor email"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                border: `2px solid ${darkMode ? '#444' : '#ddd'}`,
                borderRadius: '10px',
                fontSize: '1rem',
                marginBottom: '1rem',
                background: darkMode ? '#2d2d44' : 'white',
                color: darkMode ? 'white' : '#333'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#D32F2F',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Quero Receber Novidades!
            </button>
          </form>

          <p style={{
            fontSize: '0.8rem',
            color: darkMode ? '#999' : '#666'
          }}>
            📝 Não spam, apenas conteúdo de qualidade. Pode cancelar quando quiser.
          </p>
        </div>
      </div>
    );
  };

  // Página de Contato
  const ContactPage = () => (
    <div style={{ 
      background: darkMode ? '#1a1a2e' : 'white', 
      padding: '3rem', 
      borderRadius: '20px', 
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <h2 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '900', 
        color: darkMode ? 'white' : '#1A1A2E',
        marginBottom: '1rem'
      }}>
        📞 Contato
      </h2>
      <p style={{ 
        fontSize: '1.2rem', 
        color: darkMode ? '#cccccc' : '#666666',
        marginBottom: '2rem'
      }}>
        Entre em contato conosco para sugestões, críticas ou parcerias!
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginTop: '3rem'
      }}>
        <div style={{
          background: darkMode ? '#2d2d44' : '#FFF8DC',
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
          <h3 style={{ color: darkMode ? 'white' : '#1A1A2E', marginBottom: '0.5rem' }}>Email</h3>
          <p style={{ color: darkMode ? '#cccccc' : '#666666' }}>contato@minhacritica.com</p>
        </div>
        
        <div style={{
          background: darkMode ? '#2d2d44' : '#FFF8DC',
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
          <h3 style={{ color: darkMode ? 'white' : '#1A1A2E', marginBottom: '0.5rem' }}>Instagram</h3>
          <p style={{ color: darkMode ? '#cccccc' : '#666666', marginBottom: '1rem' }}>
            @minhacriticanaoespecializada
          </p>
          <a 
            href="https://www.instagram.com/minhacriticanaoespecializada/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(45deg, #E1306C, #F77737)',
              color: 'white',
              padding: '0.8rem 1.5rem',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(225, 48, 108, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span>📸</span>
            Seguir no Instagram
          </a>
        </div>
      </div>
    </div>
  );

  // Footer com Newsletter
  const Footer = () => {
    const handleFooterSubscribe = (e) => {
      e.preventDefault();
      if (!newsletterEmail) {
        alert('Por favor, digite seu email!');
        return;
      }

      const subscribers = loadNewsletterSubscribers();
      const updatedSubscribers = [...subscribers, {
        email: newsletterEmail,
        date: new Date().toISOString(),
        active: true
      }];

      localStorage.setItem('newsletter-subscribers', JSON.stringify(updatedSubscribers));
      setNewsletterEmail('');
      alert('🎉 Obrigado por se inscrever!');
    };

    return (
      <footer style={{
        background: '#1A1A2E',
        color: '#FFF8DC',
        padding: '3rem 1rem',
        marginTop: '4rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Logo e Descrição */}
            <div>
              <img 
                src="/images/logo-minha-critica.png" 
                alt="Minha Crítica Não Especializada" 
                style={{ 
                  height: '80px', 
                  width: 'auto', 
                  marginBottom: '1.5rem',
                  filter: 'drop-shadow(0 4px 12px rgba(255,167,38,0.4))'
                }} 
              />
              <p style={{ marginBottom: '1rem', color: '#4DB6AC', fontSize: '1.1rem' }}>
                Opiniões sinceras sobre cinema e séries, sem frescura.
              </p>
            </div>

            {/* Newsletter no Footer */}
            <div>
              <h3 style={{ color: '#FFA726', marginBottom: '1rem', fontSize: '1.2rem' }}>
                📧 Newsletter
              </h3>
              <p style={{ color: '#FFF8DC', marginBottom: '1rem', fontSize: '0.9rem' }}>
                Receba as melhores críticas e novidades no seu email.
              </p>
              <form onSubmit={handleFooterSubscribe} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Seu email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '0.9rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#D32F2F',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Inscrever
                </button>
              </form>
            </div>
          </div>

          {/* Instagram e Copyright */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              © 2024 Minha Crítica Não Especializada.
            </p>
            
            <a 
              href="https://www.instagram.com/minhacriticanaoespecializada/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(45deg, #E1306C, #F77737)',
                color: 'white',
                padding: '0.6rem 1.2rem',
                borderRadius: '20px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              <span>📸</span>
              Siga nosso Instagram
            </a>
          </div>
        </div>
      </footer>
    );
  };

  // Sistema de Admin com Gerenciamento de Posts
  const AdminPanel = () => {
    const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('admin_token'));
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
    const [adminLoading, setAdminLoading] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [syncStatus, setSyncStatus] = useState('');

    const handleLogin = async () => {
      try {
        setAdminLoading(true);
        const data = await api.login(adminLogin.username, adminLogin.password);
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        setAdminLogin({ username: '', password: '' });
        setSyncStatus('🟢 Conectado ao MySQL');
      } catch (e) { 
        alert('❌ ' + e.message);
        setSyncStatus('🔴 Erro de conexão');
      } finally { 
        setAdminLoading(false); 
      }
    };

    const handleLogout = () => { 
      localStorage.removeItem('admin_token'); 
      setToken(''); 
      setIsLoggedIn(false); 
      setSyncStatus('');
    };

    const handleSave = async () => {
      if (!form.title || !form.excerpt) { 
        alert('Preencha título e resumo!'); 
        return; 
      }
      try {
        setAdminLoading(true);
        const postData = {
          ...form, 
          rating: form.rating ? parseFloat(form.rating) : null,
          date: new Date().toISOString().split('T')[0],
          highlights: form.highlights ? form.highlights.split('\n').filter(h => h.trim()) : [],
          lowlights: form.lowlights ? form.lowlights.split('\n').filter(l => l.trim()) : []
        };
        
        if (editingPost) {
          // Atualizar post no MySQL
          await api.updatePost(editingPost.id, postData, token);
          setSyncStatus('✅ Post atualizado no MySQL!');
        } else {
          // Criar novo post no MySQL
          await api.createPost(postData, token);
          setSyncStatus('✅ Post criado no MySQL!');
        }
        
        // Recarregar posts
        await loadPosts();
        
        alert(`✅ Post ${editingPost ? 'atualizado' : 'criado'} com sucesso!`);
        setForm({ 
          title: '', category: 'críticas', type: 'Filme', image: '', excerpt: '', 
          rating: '', readTime: '', fullContent: '', highlights: '', lowlights: '' 
        });
        setEditingPost(null);
      } catch (e) { 
        alert('❌ ' + e.message);
        setSyncStatus('🔴 Erro ao salvar no MySQL');
      } finally { 
        setAdminLoading(false); 
      }
    };

    const handleEdit = (post) => {
      setEditingPost(post);
      setForm({
        title: post.title,
        category: post.category,
        type: post.type,
        image: post.image || '',
        excerpt: post.excerpt,
        rating: post.rating || '',
        readTime: post.readTime || '',
        fullContent: post.fullContent || '',
        highlights: post.highlights ? post.highlights.join('\n') : '',
        lowlights: post.lowlights ? post.lowlights.join('\n') : ''
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (postId) => {
      if (window.confirm('Tem certeza que deseja excluir este post?')) {
        try {
          await api.deletePost(postId, token);
          setSyncStatus('✅ Post excluído do MySQL!');
          await loadPosts(); // Recarregar lista
          alert('✅ Post excluído com sucesso!');
        } catch (error) {
          alert('❌ Erro ao excluir post: ' + error.message);
          setSyncStatus('🔴 Erro ao excluir do MySQL');
        }
      }
    };

    const cancelEdit = () => {
      setEditingPost(null);
      setForm({ 
        title: '', category: 'críticas', type: 'Filme', image: '', excerpt: '', 
        rating: '', readTime: '', fullContent: '', highlights: '', lowlights: '' 
      });
    };

    // TELA DE LOGIN DO ADMIN
    if (!isLoggedIn) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          background: darkMode ? '#0a0a1a' : '#FFF8DC', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontFamily: "'Poppins', sans-serif" 
        }}>
          <div style={{ 
            background: darkMode ? '#1a1a2e' : 'white', 
            padding: '2.5rem', 
            borderRadius: '20px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)', 
            maxWidth: '400px', 
            width: '100%' 
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem' }}>🔐</div>
              <h1 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '900', 
                color: darkMode ? 'white' : '#1A1A2E', 
                marginTop: '1rem' 
              }}>
                Painel Admin
              </h1>
              <p style={{ color: darkMode ? '#cccccc' : '#666666' }}>Minha Crítica Não Especializada</p>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#4DB6AC', 
                marginTop: '0.5rem',
                background: 'rgba(77,182,172,0.1)',
                padding: '0.5rem',
                borderRadius: '5px'
              }}>
                🗄️ Conectado ao MySQL
              </p>
            </div>
            
            <input 
              type="text" 
              placeholder="Usuário" 
              value={adminLogin.username}
              onChange={e => setAdminLogin({...adminLogin, username: e.target.value})} 
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                borderRadius: '8px', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                background: darkMode ? '#2d2d44' : 'white',
                color: darkMode ? 'white' : '#333'
              }} 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              value={adminLogin.password}
              onChange={e => setAdminLogin({...adminLogin, password: e.target.value})}
              onKeyPress={e => e.key === 'Enter' && handleLogin()} 
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                borderRadius: '8px', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                background: darkMode ? '#2d2d44' : 'white',
                color: darkMode ? 'white' : '#333'
              }} 
            />
            
            <button 
              onClick={handleLogin} 
              disabled={adminLoading} 
              style={{ 
                width: '100%', 
                background: '#D32F2F', 
                color: 'white', 
                border: 'none', 
                padding: '1rem', 
                borderRadius: '10px', 
                fontSize: '1.1rem', 
                fontWeight: '700', 
                cursor: 'pointer', 
                marginBottom: '1rem' 
              }}
            >
              {adminLoading ? '⏳ Entrando...' : '🔐 Entrar no MySQL'}
            </button>
            
            <button 
              onClick={() => setShowAdmin(false)} 
              style={{ 
                width: '100%', 
                background: '#999', 
                color: 'white', 
                border: 'none', 
                padding: '0.8rem', 
                borderRadius: '10px', 
                fontSize: '1rem', 
                cursor: 'pointer' 
              }}
            >
              ← Voltar ao Blog
            </button>
            
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
              Usuário: admin | Senha: admin123
            </p>
          </div>
        </div>
      );
    }

    // PAINEL ADMIN LOGADO
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: darkMode ? '#0a0a1a' : '#FFF8DC', 
        fontFamily: "'Poppins', sans-serif" 
      }}>
        <header style={{ 
          background: 'linear-gradient(135deg, #D32F2F 0%, #1A1A2E 100%)', 
          padding: '1rem 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '900' }}>
              🎬 Painel Admin - Minha Crítica
            </h1>
            <p style={{ color: '#4DB6AC', fontSize: '0.9rem', marginTop: '0.2rem' }}>
              {posts.length} posts • {syncStatus || '🟢 Conectado ao MySQL'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowAdmin(false)} style={{ 
              background: '#4DB6AC', 
              color: 'white', 
              border: 'none', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '700' 
            }}>
              ← Voltar ao Blog
            </button>
            <button onClick={handleLogout} style={{ 
              background: '#FFA726', 
              color: 'white', 
              border: 'none', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '700'
            }}>
              Sair
            </button>
          </div>
        </header>
        
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          {/* FORMULÁRIO DE CRIAÇÃO/EDIÇÃO */}
          <div style={{ 
            background: darkMode ? '#1a1a2e' : 'white', 
            borderRadius: '15px', 
            padding: '2rem', 
            marginBottom: '2rem', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              color: darkMode ? 'white' : '#1A1A2E', 
              marginBottom: '1.5rem' 
            }}>
              {editingPost ? '✏️ Editar Post' : '➕ Criar Novo Post'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Título *" 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  marginBottom: '1rem',
                  background: darkMode ? '#2d2d44' : 'white',
                  color: darkMode ? 'white' : '#333'
                }} 
              />
              <select 
                value={form.category} 
                onChange={e => setForm({ ...form, category: e.target.value })} 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  marginBottom: '1rem',
                  background: darkMode ? '#2d2d44' : 'white',
                  color: darkMode ? 'white' : '#333'
                }}
              >
                <option value="críticas">Críticas</option>
                <option value="séries">Séries</option>
                <option value="notícias">Notícias</option>
              </select>
              <select 
                value={form.type} 
                onChange={e => setForm({ ...form, type: e.target.value })} 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  marginBottom: '1rem',
                  background: darkMode ? '#2d2d44' : 'white',
                  color: darkMode ? 'white' : '#333'
                }}
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
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  marginBottom: '1rem',
                  background: darkMode ? '#2d2d44' : 'white',
                  color: darkMode ? 'white' : '#333'
                }} 
              />
              <input 
                type="number" 
                placeholder="Nota (0-5)" 
                min="0" 
                max="5" 
                step="0.5" 
                value={form.rating} 
                onChange={e => setForm({ ...form, rating: e.target.value })} 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  marginBottom: '1rem',
                  background: darkMode ? '#2d2d44' : 'white',
                  color: darkMode ? 'white' : '#333'
                }} 
              />
              <input 
                type="text" 
                placeholder="Tempo de leitura (ex: 5 min)" 
                value={form.readTime} 
                onChange={e => setForm({ ...form, readTime: e.target.value })} 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  marginBottom: '1rem',
                  background: darkMode ? '#2d2d44' : 'white',
                  color: darkMode ? 'white' : '#333'
                }} 
              />
            </div>
            
            <textarea 
              placeholder="Resumo *" 
              rows="3" 
              value={form.excerpt} 
              onChange={e => setForm({ ...form, excerpt: e.target.value })} 
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                borderRadius: '8px', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                background: darkMode ? '#2d2d44' : 'white',
                color: darkMode ? 'white' : '#333',
                resize: 'vertical'
              }} 
            />
            
            <textarea 
              placeholder="Conteúdo completo (separe parágrafos com linha em branco)" 
              rows="8" 
              value={form.fullContent} 
              onChange={e => setForm({ ...form, fullContent: e.target.value })} 
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                borderRadius: '8px', 
                fontSize: '1rem', 
                marginBottom: '1rem',
                background: darkMode ? '#2d2d44' : 'white',
                color: darkMode ? 'white' : '#333',
                resize: 'vertical'
              }} 
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <textarea 
                placeholder="✅ Pontos positivos (um por linha)" 
                rows="4" 
                value={form.highlights} 
                onChange={e => setForm({ ...form, highlights: e.target.value })} 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  marginBottom: '1rem',
                  background: darkMode ? '#2d2d44' : 'white',
                  color: darkMode ? 'white' : '#333',
                  resize: 'vertical'
                }} 
              />
              <textarea 
                placeholder="⚠️ Pontos negativos (um por linha)" 
                rows="4" 
                value={form.lowlights} 
                onChange={e => setForm({ ...form, lowlights: e.target.value })} 
                style={{ 
                  width: '100%', 
                  padding: '0.8rem', 
                  border: `2px solid ${darkMode ? '#444' : '#ddd'}`, 
                  borderRadius: '8px', 
                  fontSize: '1rem', 
                  marginBottom: '1rem',
                  background: darkMode ? '#2d2d44' : 'white',
                  color: darkMode ? 'white' : '#333',
                  resize: 'vertical'
                }} 
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={handleSave} 
                disabled={adminLoading} 
                style={{ 
                  background: '#D32F2F', 
                  color: 'white', 
                  border: 'none', 
                  padding: '1rem 2rem', 
                  borderRadius: '10px', 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  cursor: 'pointer'
                }}
              >
                {adminLoading ? 'Salvando...' : editingPost ? '💾 Atualizar Post' : '💾 Criar Post'}
              </button>
              
              {editingPost && (
                <button 
                  onClick={cancelEdit}
                  style={{ 
                    background: '#999', 
                    color: 'white', 
                    border: 'none', 
                    padding: '1rem 2rem', 
                    borderRadius: '10px', 
                    fontSize: '1rem', 
                    fontWeight: '700', 
                    cursor: 'pointer'
                  }}
                >
                  ❌ Cancelar Edição
                </button>
              )}
            </div>

            {syncStatus && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: syncStatus.includes('✅') ? 'rgba(77,182,172,0.1)' : 'rgba(255,167,38,0.1)',
                borderRadius: '8px',
                border: `1px solid ${syncStatus.includes('✅') ? '#4DB6AC' : '#FFA726'}`,
                color: syncStatus.includes('✅') ? '#4DB6AC' : '#FFA726',
                fontSize: '0.9rem'
              }}>
                {syncStatus}
              </div>
            )}
          </div>

          {/* LISTA DE POSTS EXISTENTES */}
          <div style={{ 
            background: darkMode ? '#1a1a2e' : 'white', 
            borderRadius: '15px', 
            padding: '2rem', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              color: darkMode ? 'white' : '#1A1A2E', 
              marginBottom: '1.5rem' 
            }}>
              📝 Posts no Banco de Dados ({posts.length})
            </h2>
            
            {posts.length === 0 ? (
              <p style={{ color: darkMode ? '#cccccc' : '#666666', textAlign: 'center', padding: '2rem' }}>
                Nenhum post criado ainda.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {posts.map(post => (
                  <div key={post.id} style={{
                    background: darkMode ? '#2d2d44' : '#FFF8DC',
                    padding: '1.5rem',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        color: darkMode ? 'white' : '#1A1A2E', 
                        marginBottom: '0.5rem',
                        fontSize: '1.1rem'
                      }}>
                        {post.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ 
                          background: '#D32F2F', 
                          color: 'white', 
                          padding: '0.3rem 0.8rem', 
                          borderRadius: '15px', 
                          fontSize: '0.8rem' 
                        }}>
                          {post.category}
                        </span>
                        <span style={{ 
                          background: '#4DB6AC', 
                          color: 'white', 
                          padding: '0.3rem 0.8rem', 
                          borderRadius: '15px', 
                          fontSize: '0.8rem' 
                        }}>
                          {post.type}
                        </span>
                        <span style={{ color: darkMode ? '#cccccc' : '#666666', fontSize: '0.9rem' }}>
                          📅 {new Date(post.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => handleEdit(post)}
                        style={{
                          background: '#FFA726',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        style={{
                          background: '#D32F2F',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        🗑️ Excluir
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

  // Loading State
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: darkMode ? '#0a0a1a' : '#FFF8DC',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem', 
          animation: 'spin 1s linear infinite' 
        }}>
          🎬
        </div>
        <h2 style={{ color: darkMode ? 'white' : '#1A1A2E' }}>
          {error ? 'Erro ao carregar' : 'Carregando posts do MySQL...'}
        </h2>
        {error && (
          <p style={{ color: '#FFA726', marginTop: '1rem', textAlign: 'center' }}>
            {error}
          </p>
        )}
        <style>{`
          @keyframes spin { 
            from { transform: rotate(0deg); } 
            to { transform: rotate(360deg); } 
          }
        `}</style>
      </div>
    );
  }

  // PAINEL ADMIN
  if (showAdmin) {
    return <AdminPanel />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: darkMode ? '#0a0a1a' : '#FFF8DC',
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* SEO Head */}
      <SEOHead />
      
      <Header />
      
      <main style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Banner de Slides */}
          <SlideshowBanner />
          
          {/* Cabeçalho da Página */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '900', 
                color: darkMode ? 'white' : '#1A1A2E'
              }}>
                {searchTerm ? (
                  <>🔍 Resultados para: "{searchTerm}"</>
                ) : currentPage === 'home' ? '🎬 Todos os Posts' : 
                  currentPage === 'críticas' ? '🎥 Todas as Críticas' :
                  currentPage === 'séries' ? '📺 Todas as Séries' :
                  currentPage === 'notícias' ? '📰 Todas as Notícias' :
                  currentPage === 'contato' ? '📞 Contato' :
                  currentPage}
              </h2>
              
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage('home');
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #D32F2F',
                    color: '#D32F2F',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    marginTop: '0.5rem'
                  }}
                >
                  Limpar busca
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
              <span style={{ 
                background: error ? '#FFA726' : '#4DB6AC', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px', 
                fontSize: '0.9rem', 
                fontWeight: '700'
              }}>
                {error ? '📦 Modo Offline' : '🗄️ MySQL'} • {posts.length} posts
              </span>
              <button 
                onClick={() => setShowAdmin(true)}
                style={{
                  background: 'transparent',
                  border: '1px solid #4DB6AC',
                  color: '#4DB6AC',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}
              >
                ➕ Criar Post
              </button>
            </div>
          </div>

          {/* Mensagem de status */}
          {error && (
            <div style={{
              background: '#FFA726',
              color: 'white',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <strong>⚠️ Modo Offline:</strong> {error}
              <button 
                onClick={loadPosts}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid white',
                  color: 'white',
                  padding: '0.4rem 1rem',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  marginLeft: '1rem',
                  fontSize: '0.8rem'
                }}
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {/* Página de Contato */}
          {currentPage === 'contato' && <ContactPage />}

          {/* Grid de Posts */}
          {currentPage !== 'contato' && (posts.length === 0 ? (
            <div style={{ 
              background: darkMode ? '#1a1a2e' : 'white', 
              padding: '3rem', 
              borderRadius: '20px', 
              textAlign: 'center', 
              color: darkMode ? '#999' : '#666', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: darkMode ? 'white' : '#1A1A2E',
                marginBottom: '0.5rem'
              }}>
                Nenhum post encontrado
              </h3>
              <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
                {error 
                  ? 'Não foi possível carregar os posts do MySQL.'
                  : 'Você ainda não tem posts cadastrados no banco de dados.'
                }
              </p>
              <button 
                onClick={() => setShowAdmin(true)}
                style={{
                  background: '#D32F2F',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '700'
                }}
              >
                ➕ Criar Primeiro Post
              </button>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '2rem' 
            }}>
              {posts
                .filter(post => {
                  if (searchTerm) {
                    const term = searchTerm.toLowerCase();
                    return (
                      post.title?.toLowerCase().includes(term) ||
                      post.excerpt?.toLowerCase().includes(term) ||
                      post.type?.toLowerCase().includes(term) ||
                      post.category?.toLowerCase().includes(term)
                    );
                  }
                  return currentPage === 'home' ? true : post.category === currentPage;
                })
                .map(post => (
                  <div 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    style={{
                      background: darkMode ? '#1a1a2e' : 'white',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(211, 47, 47, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
                    }}
                  >
                    <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                      <img 
                        src={post.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400'} 
                        alt={post.title}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: '#D32F2F',
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}>
                        {post.type}
                      </div>
                      {post.rating && (
                        <div style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: '#FFD700',
                          color: '#1A1A2E',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          ⭐ {post.rating}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ 
                        fontSize: '1.3rem', 
                        fontWeight: '800', 
                        color: darkMode ? 'white' : '#1A1A2E', 
                        marginBottom: '0.8rem',
                        lineHeight: '1.3'
                      }}>
                        {post.title}
                      </h3>
                      <p style={{ 
                        color: darkMode ? '#cccccc' : '#666666', 
                        lineHeight: '1.6', 
                        marginBottom: '1rem',
                        flex: 1
                      }}>
                        {post.excerpt}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        paddingTop: '1rem', 
                        borderTop: `1px solid ${darkMode ? '#2d2d44' : '#FFF8DC'}`,
                        fontSize: '0.85rem',
                        color: darkMode ? '#999999' : '#888888'
                      }}>
                        <span>📅 {new Date(post.date).toLocaleDateString('pt-BR')}</span>
                        {post.readTime && <span>⏱️ {post.readTime}</span>}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </main>
      
      {/* Footer com Newsletter */}
      <Footer />

      {/* Modal de Leitura Completa */}
      {selectedPost && (
        <PostDetail 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}

      {/* Newsletter Popup */}
      <NewsletterPopup />
    </div>
  );
}

export default App;