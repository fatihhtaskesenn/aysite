import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Store, CreditCard, ChevronRight, ChevronLeft, Maximize2, Sparkles } from 'lucide-react';
import { fetchHeroBanners, getLocalHeroCache, DEFAULT_HERO_BANNERS } from '../services/heroService';
import ImageLightboxModal from './ImageLightboxModal';
import './HeroBanner.css';

export default function HeroBanner() {
  const initialBanners = getLocalHeroCache() || DEFAULT_HERO_BANNERS;
  const [banners, setBanners] = useState(initialBanners);
  const [activeIndex, setActiveIndex] = useState(Math.floor(initialBanners.length / 2));
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    async function loadBanners() {
      const res = await fetchHeroBanners();
      const loadedData = (res.data || []).filter(b => b.is_active !== false);
      if (loadedData.length > 0) {
        setBanners(loadedData);
      }
    }
    loadBanners();
  }, []);

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleNext = () => {
    if (banners.length === 0) return;
    setActiveIndex((activeIndex + 1) % banners.length);
  };

  const handlePrev = () => {
    if (banners.length === 0) return;
    setActiveIndex((activeIndex - 1 + banners.length) % banners.length);
  };

  const handleCardClick = (idx, banner) => {
    if (idx === activeIndex) {
      // Open full-screen Lightbox Modal on center card click
      setLightboxImage(banner.image);
    } else {
      setActiveIndex(idx);
    }
  };

  const getCardClass = (index) => {
    const total = banners.length;
    if (total === 0) return 'coverflow-card hidden';
    let diff = (index - activeIndex) % total;
    if (diff < 0) diff += total;

    if (diff === 0) return 'coverflow-card center';
    if (diff === 1) return 'coverflow-card right-1';
    if (diff === 2) return 'coverflow-card right-2';
    if (diff === total - 1) return 'coverflow-card left-1';
    if (diff === total - 2) return 'coverflow-card left-2';
    return 'coverflow-card hidden';
  };

  return (
    <section className="hero-banner-section">
      <div className="hero-expanded-container">
        
        {/* Full-width 3D Cover Flow Carousel Stage */}
        <div className="hero-coverflow-container">
          
          <button className="coverflow-nav-btn prev" onClick={handlePrev} title="Önceki Görsel">
            <ChevronLeft size={32} />
          </button>

          <div className="coverflow-stage">
            {banners.map((banner, idx) => {
              const cardClass = getCardClass(idx);
              const isCenter = idx === activeIndex;

              return (
                <div 
                  key={banner.id || idx} 
                  className={cardClass}
                  onClick={() => handleCardClick(idx, banner)}
                  title={isCenter ? "Resmi büyütmek için tıklayın" : "Öne çıkar"}
                >
                  <div className="card-image-wrap pure-image-only">
                    {/* Blurred backdrop image for proportional ratio fitting */}
                    <div 
                      className="image-blur-backdrop" 
                      style={{ backgroundImage: `url(${banner.image})` }} 
                    />
                    
                    {/* Main Image fitted proportionally */}
                    <img 
                      src={banner.image} 
                      alt={banner.title || 'Kampanya Afişi'} 
                      className="main-banner-img"
                    />
                    
                    {/* Hover Zoom Icon for Center Card */}
                    {isCenter && (
                      <div className="zoom-hover-overlay">
                        <Maximize2 size={32} />
                        <span>Resmi Büyütmek İçin Tıklayın</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="coverflow-nav-btn next" onClick={handleNext} title="Sonraki Görsel">
            <ChevronRight size={32} />
          </button>

        </div>

        {/* Dots Pagination */}
        <div className="hero-coverflow-dots">
          {banners.map((_, idx) => (
            <button 
              key={idx} 
              className={`coverflow-dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>

        {/* Retail Trust Features Row */}
        <div className="container">
          <div className="trust-features-row">
            <div className="trust-item">
              <div className="trust-icon"><Truck size={24} color="#d90429" /></div>
              <div>
                <strong>Ücretsiz Kargo</strong>
                <span>500 TL üzeri tüm alışverişlerde</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><Store size={24} color="#d90429" /></div>
              <div>
                <strong>Mağazadan Teslimat</strong>
                <span>Fiziksel Çeyza Mağazalarından teslim alabilirsiniz</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><CreditCard size={24} color="#d90429" /></div>
              <div>
                <strong>Peşin Fiyatına Taksit</strong>
                <span>Tüm kartlara 12 taksite varan fırsatlar</span>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><ShieldCheck size={24} color="#d90429" /></div>
              <div>
                <strong>%100 Orijinal Garanti</strong>
                <span>Resmi faturalı ve 2 yıl Çeyza güvencesi</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal for Enlarging Pure Images */}
      <ImageLightboxModal 
        imageUrl={lightboxImage} 
        onClose={() => setLightboxImage(null)} 
      />
    </section>
  );
}
