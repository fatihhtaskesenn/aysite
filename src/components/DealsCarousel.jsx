import React, { useState, useEffect, useRef } from 'react';
import { fetchProducts } from '../services/productService';
import { Flame, ChevronLeft, ChevronRight, ShoppingCart, Eye, Sparkles, Clock } from 'lucide-react';
import ProductCard from './ProductCard';
import './DealsCarousel.css';

export default function DealsCarousel({ onAddToCart, onQuickView }) {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 48, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadDeals() {
      setLoading(true);
      const res = await fetchProducts();
      const allProds = res.data || [];
      
      // Filter products marked as deal or badge containing "Fırsat" / "İndirim"
      let deals = allProds.filter(p => 
        p.is_deal === true || 
        p.isDeal === true || 
        (p.badge && (p.badge.includes('Fırsat') || p.badge.includes('İNDİRİM') || p.badge.includes('Satan') || p.badge.includes('Yılın')))
      );

      // Fallback: If less than 4 deals, pick top discounted products
      if (deals.length < 4) {
        deals = allProds.slice(0, 8);
      }

      setDealProducts(deals);
      setLoading(false);
    }
    loadDeals();
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="deals-carousel-section">
      <div className="container">
        
        {/* Deals Header with Countdown */}
        <div className="deals-header-row">
          <div className="deals-title-area">
            <h2>Haftanın Fırsat Ürünleri</h2>
            <p>Sınırlı stok ve özel taksit avantajlarıyla sunulan kampanya ürünleri.</p>
          </div>

          <div className="deals-countdown-box">
            <div className="countdown-label">
              <Clock size={15} /> Kalan Süre:
            </div>
            <div className="countdown-timer">
              <div className="time-block">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <label>Saat</label>
              </div>
              <span className="colon">:</span>
              <div className="time-block">
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <label>Dakika</label>
              </div>
              <span className="colon">:</span>
              <div className="time-block">
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <label>Saniye</label>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slider Stage */}
        <div className="deals-slider-wrapper">
          <button 
            className="slider-nav-btn prev" 
            onClick={() => handleScroll('left')}
            title="Önceki Fırsatlar"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="deals-scroll-container" ref={scrollContainerRef}>
            {loading ? (
              <div className="deals-loading-box">
                <div className="spinner"></div>
                <span>Fırsat ürünleri yükleniyor...</span>
              </div>
            ) : dealProducts.length === 0 ? (
              <div className="no-deals-box">
                <p>Henüz fırsat ürünü işaretlenmedi.</p>
              </div>
            ) : (
              dealProducts.map(product => (
                <div key={product.id} className="deal-card-item">
                  <ProductCard 
                    product={product} 
                    onAddToCart={onAddToCart} 
                    onQuickView={onQuickView} 
                  />
                </div>
              ))
            )}
          </div>

          <button 
            className="slider-nav-btn next" 
            onClick={() => handleScroll('right')}
            title="Sonraki Fırsatlar"
          >
            <ChevronRight size={24} />
          </button>
        </div>

      </div>
    </section>
  );
}
