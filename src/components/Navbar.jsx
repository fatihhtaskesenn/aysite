import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ChevronRight } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled glass' : ''}`}>
      <div className="container navbar-container">
        <a href="#" className="navbar-logo">
          <div className="logo-icon">
            <Sparkles className="icon-glow" size={24} />
          </div>
          <span className="logo-text">CEYZA<span className="logo-dot">.</span></span>
        </a>

        <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#hero" onClick={() => setMobileMenuOpen(false)}>Ana Sayfa</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Hizmetlerimiz</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Neden Biz?</a>
          <a href="#portfolio" onClick={() => setMobileMenuOpen(false)}>Projelerimiz</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>İletişim</a>
          <a href="#contact" className="btn btn-primary nav-mobile-btn" onClick={() => setMobileMenuOpen(false)}>
            Teklif Alın <ChevronRight size={18} />
          </a>
        </nav>

        <div className="navbar-actions">
          <a href="#contact" className="btn btn-primary nav-desktop-btn">
            Teklif Alın <ChevronRight size={18} />
          </a>
          <button 
            className="mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menüyü Aç/Kapat"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </header>
  );
}
