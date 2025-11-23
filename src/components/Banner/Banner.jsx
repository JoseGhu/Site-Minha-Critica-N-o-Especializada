import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { colors } from '../../styles/colors';
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

];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-container">
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
            <p style={{ color: colors.secondary }}>{slide.subtitle}</p>
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