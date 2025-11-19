import React, { useState, useEffect } from 'react';
import { Film, Tv, Newspaper, Mail, Home, Star, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// Paleta de cores extraída do logo
const colors = {
  primary: '#D32F2F', // Vermelho do logo
  secondary: '#FFA726', // Laranja/Amarelo das luzes
  accent: '#4DB6AC', // Verde-água das estrelas
  dark: '#1A1A2E', // Azul escuro do fundo
  cream: '#FFF8DC', // Creme do fundo
  gold: '#FFD700', // Dourado da estrela
};

// Dados do banner - AGORA COM IMAGENS LOCAIS
const bannerSlides = [
  {
    id: 1,
    image: "/images/banner-1.jpg", // Coloque sua imagem em public/images/banner-1.jpg
    title: "As Melhores Críticas de Cinema",
    subtitle: "Análises sinceras sem complicação"
  },
  {
    id: 2,
    image: "/images/banner-2.jpg", // Coloque sua imagem em public/images/banner-2.jpg
    title: "Séries Imperdíveis da Temporada",
    subtitle: "Descubra suas próximas maratonas"
  },
  {
    id: 3,
    image: "/images/banner-3.jpg", // Coloque sua imagem em public/images/banner-3.jpg
    title: "Notícias Quentes do Mundo do Entretenimento",
    subtitle: "Fique por dentro das novidades"
  }
];

// Dados de exemplo - AGORA COM IMAGENS LOCAIS
const postsData = [
  {
    id: 1,
    title: "Os Donos do Jogo: Netflix Acerta na Máfia Brasileira",
    category: "séries",
    type: "Série",
    image: "/images/donos-do-jogo.jpg", // Coloque em public/images/donos-do-jogo.jpg
    excerpt: "Produção brasileira de altíssima qualidade traz todos os elementos clássicos de tramas de máfia: ação, tiroteios, ascensão ao poder e conflitos familiares...",
    rating: 4,
    date: "2024-11-19",
    readTime: "8 min",
    fullContent: `Os Donos do Jogo, produção original da Netflix, é uma série brasileira que entrega exatamente o que promete: um mergulho intenso e estiloso no submundo dos cassinos e da máfia no Rio de Janeiro. A trama traz tudo que um bom drama criminal precisa: ação, tiroteio, brigas familiares, disputa por poder, tudo isso dentro de um roteiro simples mas muito bem estruturado.

As atuações elevam demais a série. André Lamoglia como Profeta, Mel Maia como Mirna, Juliana Paes como Leila e Chico Diaz como Galego dão um verdadeiro show. Mel Maia, em especial, surpreende pela entrega e maturidade, deixando para trás a imagem de polêmicas e mostrando seu talento real. A química caótica entre Profeta e Mirna funciona desde as cenas mais quentes até um simples olhar.

O antagonista Búfalo, interpretado por Xamã, até tenta se sustentar pelo carisma, mas o personagem é mal escrito e muitas vezes incoerente para alguém que deveria ser uma das figuras mais poderosas da trama. Em compensação, Galego, vivido por Chico Diaz, é um espetáculo à parte, com inspiração evidente em clássicos como O Poderoso Chefão, mas sem ficar caricato.

O arco de Leila, interpretada por Juliana Paes, é previsível mas bem executado, e ela entrega exatamente o que o papel pede. Já os conflitos entre as irmãs Suzana e Mirna prometem ser o combustível emocional da segunda temporada já confirmada pela Netflix.

No geral, Os Donos do Jogo é uma série envolvente, bem produzida e com personagens marcantes. Mesmo com pequenos tropeços como detalhes de produção meio aleatórios, a experiência final é muito positiva.`,
    highlights: [
      "Produção brasileira de altíssima qualidade",
      "Todos os elementos clássicos de tramas de máfia",
      "Atuações de destaque: André Lamoglia, Mel Maia, Juliana Paes e Chico Diaz",
      "Mundo dos cassinos retratado de forma imersiva"
    ],
    lowlights: [
      "Antagonista Búfalo mal escrito e pouco convincente",
      "Alguns momentos forçados ou inconsistências simples",
      "Plot da personagem Leila previsível desde o início"
    ]
  },
  {
    id: 2,
    title: "Frankenstein: Del Toro Entrega Obra-Prima do Terror",
    category: "críticas",
    type: "Filme",
    image: "/images/frankenstein.jpg", // Coloque em public/images/frankenstein.jpg
    excerpt: "Adaptação escrita e dirigida por Guillermo del Toro começa de forma intensa, com cenas de violência bem construídas e uma filmagem ampla que reforça o quão assustadora é a criatura...",
    rating: 5,
    date: "2024-11-18",
    readTime: "7 min",
    fullContent: `Essa nova adaptação escrita e dirigida por Guillermo del Toro começa de forma intensa, com cenas de violência bem construídas e uma filmagem ampla que reforça o quão assustadora é a criatura. Logo depois, o ritmo desacelera para apresentar a história de Victor Frankenstein, interpretado com elegância e profundidade por Oscar Isaac.

A primeira hora de filme se dedica a mostrar as motivações pessoais de Victor, seu brilho científico e a perda gradual de sua humanidade enquanto constrói o monstro — tudo isso sem pressa e de forma muito bem explicada.

Depois disso, o foco passa para a criatura. Seu desenvolvimento é excelente, embora rápido demais. Jacob Elordi surpreende na atuação: a maquiagem e a caracterização são quase perfeitas, transmitindo algo frio, sem vida, mas consciente, como alguém tentando aprender a viver entre os vivos.

A personagem Elizabeth, interpretada por Mia Goth, traz um visual marcante e diálogos interessantes, mas acaba com pouco impacto real na narrativa — servindo principalmente como ponto emocional para a criatura. Ainda assim, Mia entrega uma atuação segura e competente.

No geral, é um terror gore e emocional, que te prende do começo ao fim. Del Toro entrega um filme visualmente impecável, com efeitos práticos de altíssimo nível, uma trilha sonora envolvente e uma história bem amarradinha. Arrisco dizer: é um dos melhores filmes do ano.`,
    highlights: [
      "Início intenso com cenas fortes e visualmente impactantes",
      "Construção detalhada e emocional da história de Victor",
      "Atuação impressionante de Jacob Elordi como a criatura",
      "Efeitos práticos excelentes e narrativa bem amarrada"
    ],
    lowlights: [
      "Desenvolvimento da criatura pode parecer rápido demais",
      "Personagem Elizabeth poderia ter maior profundidade"
    ]
  },
  {
    id: 3,
    title: "Meu Ayrton: Galisteu Conta Sua Versão da História",
    category: "críticas",
    type: "Documentário",
    image: "/images/meu-ayrton.jpg", // Coloque em public/images/meu-ayrton.jpg
    excerpt: "Relato sincero e emocional sobre uma relação pouco explorada. Bastidores íntimos da vida de Ayrton Senna pelos olhos da mulher que esteve ao lado dele até o fim...",
    rating: 4,
    date: "2024-11-16",
    readTime: "6 min",
    fullContent: `O documentário lançado pela ex-modelo e apresentadora Adriane Galisteu mostra seus momentos mais intensos com um dos maiores ídolos da história brasileira: Ayrton Senna. O primeiro episódio é sincero, envolvente e cheio de detalhes da curta e intensa relação dos dois — detalhes que te prendem e emocionam.

Já o segundo episódio parte para a "lavagem de roupa suja", revelando desavenças e o tratamento frio por parte da família após a morte de Ayrton. Tudo isso enquanto Adriane enfrentava tristeza, angústia e um sofrimento que não pôde demonstrar durante e após o velório.

É um documentário bem escrito, bem explicado e que serve quase como um complemento aos demais materiais sobre Senna — desta vez, narrado pelos olhos da mulher que esteve ao lado dele até o fim.`,
    highlights: [
      "Relato sincero e emocional sobre uma relação pouco explorada",
      "Bastidores íntimos da vida de Ayrton Senna",
      "Episódios bem produzidos e envolventes",
      "Complementa outros documentários de forma humana e pessoal"
    ],
    lowlights: [
      "Alguns momentos podem soar excessivamente pessoais",
      "Segundo episódio pode dividir opiniões pela abordagem dos conflitos familiares"
    ]
  },
  {
    id: 4,
    title: "Oscar 2025: Primeiras Apostas e Surpresas",
    category: "notícias",
    type: "Notícia",
    image: "/images/oscar-2025.jpg", // Coloque em public/images/oscar-2025.jpg
    excerpt: "Com a temporada de premiações se aproximando, confira os filmes que prometem dominar a corrida...",
    date: "2024-11-15",
    readTime: "5 min"
  },
  {
    id: 5,
    title: "Barbie: Mais Que Rosa, Um Fenômeno Cultural",
    category: "críticas",
    type: "Filme",
    image: "/images/barbie.jpg", // Coloque em public/images/barbie.jpg
    excerpt: "Greta Gerwig transforma um brinquedo icônico em uma reflexão inteligente sobre feminilidade e sociedade...",
    rating: 4,
    date: "2024-11-08",
    readTime: "7 min"
  },
  {
    id: 6,
    title: "Scorsese Anuncia Novo Projeto Histórico",
    category: "notícias",
    type: "Notícia",
    image: "/images/scorsese.jpg", // Coloque em public/images/scorsese.jpg
    excerpt: "O lendário diretor revela detalhes sobre seu próximo filme épico ambientado no século XIX...",
    date: "2024-11-05",
    readTime: "4 min"
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

  // Auto-advance slides
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
      {/* Slides */}
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
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
          }}>
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

      {/* Navigation Arrows */}
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

      {/* Dots Indicator */}
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
    zIndex: 100
  }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
          <img 
            src="/images/logo-minha-critica.png" // Coloque em public/images/logo-minha-critica.png
            alt="Minha Crítica Não Especializada" 
            style={{
              height: '70px',
              width: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>
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
              
              {post.highlights && (
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
              
              {post.lowlights && (
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
            <>
              <p style={{ marginBottom: '1.5rem' }}>{post.excerpt}</p>
              <p style={{ marginBottom: '1.5rem' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </>
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
        src="/images/logo-minha-critica.png" // Coloque em public/images/logo-minha-critica.png
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
        <a href="#" style={{ color: colors.secondary, textDecoration: 'none', fontWeight: '700', opacity: 0.5 }}>Twitter</a>
        <a href="#" style={{ color: colors.secondary, textDecoration: 'none', fontWeight: '700', opacity: 0.5 }}>YouTube</a>
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

  const filteredPosts = currentPage === 'home' 
    ? postsData 
    : postsData.filter(post => post.category === currentPage);

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

  return (
    <div style={{ minHeight: '100vh', background: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Banner apenas na página inicial */}
          {currentPage === 'home' && <Banner />}
          
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: colors.dark,
            marginBottom: '2rem',
            textTransform: 'capitalize'
          }}>
            {currentPage === 'home' ? 'Últimas Publicações' : currentPage}
          </h2>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}