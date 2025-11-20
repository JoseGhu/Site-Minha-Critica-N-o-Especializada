import React, { useState, useEffect } from 'react';
import { Film, Tv, Newspaper, Mail, Home, Star, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// Importar a API
const API_URL = 'http://localhost:3001/api';

// Função para buscar posts da API
async function fetchPosts(category = null) {
  try {
    const endpoint = category && category !== 'home' 
      ? `${API_URL}/posts?category=${category}` 
      : `${API_URL}/posts`;
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar posts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar posts da API:', error);
    throw error;
  }
}

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
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&q=80",
    title: "As Melhores Críticas de Cinema",
    subtitle: "Análises sinceras sem complicação"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&q=80",
    title: "Séries Imperdíveis da Temporada",
    subtitle: "Descubra suas próximas maratonas"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80",
    title: "Notícias Quentes do Mundo do Entretenimento",
    subtitle: "Fique por dentro das novidades"
  }
];

// Componente Banner
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      borderRadius: '15px',
      overflow: 'hidden',
      marginBottom: '3rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
    }}>
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            background: `linear-gradient(135deg, rgba(26,26,46,0.7) 0%, rgba(211,47,47,0.5) 100%), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            padding: '0 4rem'
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '900',
              color: 'white',
              marginBottom: '1rem',
              textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
              lineHeight: '1.1'
            }}>
              {slide.title}
            </h2>
            <p style={{
              fontSize: '1.5rem',
              color: colors.secondary,
              fontWeight: '600',
              textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
            }}>
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = colors.primary;
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.9)';
          e.target.style.color = 'inherit';
        }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = colors.primary;
          e.target.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.9)';
          e.target.style.color = 'inherit';
        }}
      >
        <ChevronRight size={24} />
      </button>

      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: index === currentSlide ? colors.secondary : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: index === currentSlide ? 'scale(1.2)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (index !== currentSlide) {
                e.target.style.background = colors.accent;
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentSlide) {
                e.target.style.background = 'rgba(255,255,255,0.5)';
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Componente Header
const Header = ({ currentPage, setCurrentPage }) => (
  <header style={{
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.dark} 100%)`,
    padding: '1.5rem 0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    overflow: 'visible' // Permite o logo ultrapassar um pouco
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
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
          onClick={() => setCurrentPage('home')}
        >
          <img 
            src="/images/logo-minha-critica.png" 
            alt="Minha Crítica Não Especializada" 
            style={{
              height: '150px',  // 🔥 AGORA sim o logo ficou grande
              width: 'auto',
              marginTop: '-20px', // sobe o logo para não estourar o header
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45))',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>

        {/* MENU */}
        <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { name: 'Início', icon: Home, page: 'home' },
            { name: 'Críticas', icon: Film, page: 'críticas' },
            { name: 'Séries', icon: Tv, page: 'séries' },
            { name: 'Notícias', icon: Newspaper, page: 'notícias' },
            { name: 'Contato', icon: Mail, page: 'contato' }
          ].map(item => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              style={{
                background: currentPage === item.page ? colors.secondary : 'transparent',
                color: colors.cream,
                border: `2px solid ${currentPage === item.page ? colors.secondary : 'transparent'}`,
                padding: '0.6rem 1.2rem',
                borderRadius: '25px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== item.page) {
                  e.target.style.border = `2px solid ${colors.accent}`;
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== item.page) {
                  e.target.style.border = '2px solid transparent';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  </header>
);

// Componente Card de Post
const PostCard = ({ post, onClick }) => (
  <article
    onClick={onClick}
    style={{
      background: 'white',
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
        src={post.image}
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
        background: colors.primary,
        color: 'white',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {post.type}
      </div>
      {post.rating && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: colors.gold,
          color: colors.dark,
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem'
        }}>
          <Star size={14} fill="currentColor" />
          {post.rating}
        </div>
      )}
    </div>
    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{
        fontSize: '1.3rem',
        fontWeight: '800',
        color: colors.dark,
        marginBottom: '0.8rem',
        lineHeight: '1.3'
      }}>
        {post.title}
      </h3>
      <p style={{
        color: '#666',
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
        borderTop: `1px solid ${colors.cream}`,
        fontSize: '0.85rem',
        color: '#999'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={14} />
          {new Date(post.date).toLocaleDateString('pt-BR')}
        </span>
        {post.readTime && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={14} />
            {post.readTime}
          </span>
        )}
      </div>
    </div>
  </article>
);

// Componente Post Individual
const PostDetail = ({ post, onBack }) => (
  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
    <button
      onClick={onBack}
      style={{
        background: colors.accent,
        color: 'white',
        border: 'none',
        padding: '0.8rem 1.5rem',
        borderRadius: '25px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '700',
        marginBottom: '2rem',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => e.target.style.transform = 'translateX(-5px)'}
      onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}
    >
      ← Voltar
    </button>
    <article style={{
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
    }}>
      <div style={{ position: 'relative', paddingTop: '50%' }}>
        <img
          src={post.image}
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
      </div>
      <div style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{
            background: colors.primary,
            color: 'white',
            padding: '0.5rem 1.2rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '700'
          }}>
            {post.type}
          </span>
          {post.rating && (
            <span style={{
              background: colors.gold,
              color: colors.dark,
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Star size={16} fill="currentColor" />
              {post.rating} / 5
            </span>
          )}
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '900',
          color: colors.dark,
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          {post.title}
        </h1>
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '2rem',
          fontSize: '0.95rem',
          color: '#666'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} />
            {new Date(post.date).toLocaleDateString('pt-BR')}
          </span>
          {post.readTime && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} />
              {post.readTime}
            </span>
          )}
        </div>
        <div style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: '#333'
        }}>
          {post.fullContent ? (
            <>
              {post.fullContent.split('\n\n').map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
              ))}
              
              {post.highlights && post.highlights.length > 0 && (
                <>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.primary, marginTop: '2.5rem', marginBottom: '1rem' }}>
                    ✅ O que funciona
                  </h2>
                  <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
                    {post.highlights.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '0.8rem', color: '#333' }}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              
              {post.lowlights && post.lowlights.length > 0 && (
                <>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: colors.primary, marginTop: '2rem', marginBottom: '1rem' }}>
                    ⚠️ O que não funciona
                  </h2>
                  <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
                    {post.lowlights.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: '0.8rem', color: '#333' }}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p style={{ marginBottom: '1.5rem' }}>{post.excerpt}</p>
          )}
        </div>
      </div>
    </article>
  </div>
);

// Componente Footer
const Footer = () => (
  <footer style={{
    background: colors.dark,
    color: colors.cream,
    padding: '3rem 2rem',
    marginTop: '4rem'
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <img 
        src="/images/logo-minha-critica.png"
        alt="Minha Crítica Não Especializada" 
        style={{
          height: '100px',
          width: 'auto',
          marginBottom: '1.5rem',
          filter: 'drop-shadow(0 4px 12px rgba(255,167,38,0.4))'
        }}
      />
      <p style={{ marginBottom: '1.5rem', color: colors.accent }}>
        Opiniões sinceras sobre cinema e séries, sem frescura.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
        <a 
          href="https://www.instagram.com/minhacriticanaoespecializada/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: colors.secondary, 
            textDecoration: 'none', 
            fontWeight: '700',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = colors.accent;
            e.target.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = colors.secondary;
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Instagram
        </a>
      </div>
      <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
        © 2025 Minha Crítica Não Especializada. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

// Componente Principal
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar posts ao iniciar
  useEffect(() => {
    loadPosts();
  }, []);

  // Recarregar quando mudar de página
  useEffect(() => {
    if (!selectedPost && currentPage !== 'contato') {
      loadPosts();
    }
  }, [currentPage]);

  // Função para carregar posts
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Carregando posts do MySQL...');
      const data = await fetchPosts(currentPage === 'home' ? null : currentPage);
      
      console.log(`✅ ${data.length} posts carregados do MySQL!`);
      setPosts(data);
      
    } catch (err) {
      console.error('❌ Erro ao carregar posts do MySQL:', err);
      setError('Erro ao conectar com o servidor. Usando dados locais.');
      
      // FALLBACK: Tentar localStorage
      const localPosts = localStorage.getItem('minha-critica-posts');
      if (localPosts) {
        const parsedPosts = JSON.parse(localPosts);
        console.log(`📦 ${parsedPosts.length} posts carregados do localStorage (backup)`);
        setPosts(parsedPosts);
      } else {
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrar posts por categoria
  const filteredPosts = currentPage === 'home' 
    ? posts 
    : posts.filter(post => post.category === currentPage);

  // Tela de Post Individual
  if (selectedPost) {
    return (
      <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main style={{ padding: '3rem 2rem' }}>
          <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
        </main>
        <Footer />
      </div>
    );
  }

  // Tela de Contato
  if (currentPage === 'contato') {
    return (
      <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main style={{ padding: '3rem 2rem' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: colors.dark, marginBottom: '1rem' }}>Entre em Contato</h2>
            <p style={{ marginBottom: '2rem', color: '#666' }}>Tem uma sugestão? Quer colaborar? Mande sua mensagem!</p>
            <input
              type="text"
              placeholder="Seu nome"
              style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: `2px solid ${colors.cream}`, borderRadius: '10px', fontSize: '1rem' }}
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: `2px solid ${colors.cream}`, borderRadius: '10px', fontSize: '1rem' }}
            />
            <textarea
              placeholder="Sua mensagem"
              rows="6"
              style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', border: `2px solid ${colors.cream}`, borderRadius: '10px', fontSize: '1rem', fontFamily: 'inherit' }}
            />
            <button style={{
              background: colors.primary,
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = colors.secondary}
            onMouseLeave={(e) => e.target.style.background = colors.primary}
            >
              Enviar Mensagem
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Tela de Loading
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: colors.cream,
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
        <h2 style={{ color: colors.dark, fontSize: '1.5rem' }}>Carregando posts do MySQL...</h2>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Tela Principal
  return (
    <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Banner apenas na home */}
          {currentPage === 'home' && <Banner />}
          
          {/* Header com indicador de fonte */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: colors.dark,
              textTransform: 'capitalize'
            }}>
              {currentPage === 'home' ? 'Últimas Publicações' : currentPage}
            </h2>
            
            {/* Indicador de fonte dos dados */}
            <span style={{
              background: error ? colors.secondary : colors.accent,
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {error ? '📦 localStorage (Backup)' : '🗄️ MySQL Conectado'} • {filteredPosts.length} posts
            </span>
          </div>
          
          {/* Lista de Posts */}
          {filteredPosts.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '3rem',
              borderRadius: '20px',
              textAlign: 'center',
              color: '#999',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                📭 Nenhum post encontrado
              </p>
              <p style={{ fontSize: '1rem' }}>
                {error 
                  ? 'Verifique se o backend está rodando em http://localhost:3001' 
                  : 'Não há posts nesta categoria ainda.'}
              </p>
              {error && (
                <button
                  onClick={loadPosts}
                  style={{
                    marginTop: '1.5rem',
                    background: colors.primary,
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Tentar Reconectar
                </button>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem'
            }}>
              {filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}