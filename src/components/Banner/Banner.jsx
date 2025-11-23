import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Banner.css';

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

const Banner = ({ darkMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`banner-container ${darkMode ? 'dark' : ''}`}>
      {bannerSlides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
          style={{
            background: `linear-gradient(135deg, rgba(26,26,46,0.7) 0%, rgba(211,47,47,0.5) 100%), url(${slide.image})`
          }}
        >
          <div className="banner-content">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
          </div>
        </div>
      ))}
      
      <button onClick={prevSlide} className="banner-nav-button prev">
        <ChevronLeft size={24} />
      </button>
      
      <button onClick={nextSlide} className="banner-nav-button next">
        <ChevronRight size={24} />
      </button>
      
      <div className="banner-indicators">
        {bannerSlides.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;