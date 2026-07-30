import React, { useState, useEffect } from 'react';
import { Search, MapPin, Heart, ShoppingCart, Menu, X, ChevronDown, ChevronRight, Info, CreditCard, MessageSquare, Phone } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import FacebookIcon from './FacebookIcon';
import { mainCategories } from '../data/categories';
import './Header.css';

export default function Header({ 
  cartCount, 
  cartTotal, 
  onOpenCart, 
  onOpenStores, 
  onOpenAbout, 
  onOpenTaksit,
  onOpenInfoModal,
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  selectedSubcat,
  setSelectedSubcat 
}) {
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectCategoryAndSubcat = (catSlug, subItemName = 'all') => {
    setSelectedCategory(catSlug);
    if (setSelectedSubcat) {
      setSelectedSubcat(subItemName);
    }
    setActiveMegaMenu(null);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="header-sticky-wrapper">
      <header className={`innovative-header ${isScrolled ? 'compact-scrolled' : ''}`}>
        
        {/* Refined Top Announcement Strip */}
        <div className="innovative-top-bar">
          <div className="container top-bar-container">
            
            {/* Social Media Pills Left */}
            <div className="top-bar-left">
              <span className="social-label">Bizi Takip Edin:</span>
              <a 
                href="https://www.instagram.com/ceyzavm/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="top-social-pill"
              >
                <InstagramIcon size={13} /> Instagram (@ceyzavm)
              </a>

              <a 
                href="https://www.facebook.com/Ceyza.Avm/?ref=NONE_xav_ig_profile_page_web#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="top-social-pill"
              >
                <FacebookIcon size={13} /> Facebook
              </a>
            </div>

            {/* Branches and Corporate Info Right */}
            <div className="top-bar-right">
              <span className="top-phone-pill" style={{ color: '#ffffff', fontSize: '0.8rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={13} /> 0850 644 1616
              </span>

              <span className="top-divider">|</span>

              <button onClick={() => onOpenInfoModal && onOpenInfoModal('ask-question')} className="top-nav-btn" style={{ background: '#ffffff', color: '#d90429', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 800 }}>
                <MessageSquare size={13} /> <span>💬 Bize Soru Sor</span>
              </button>

              <span className="top-divider">|</span>

              <button onClick={onOpenStores} className="top-nav-btn">
                <MapPin size={14} /> <span>Mağazalarımız</span>
              </button>

              <span className="top-divider">|</span>

              <button onClick={onOpenAbout} className="top-nav-btn">
                <Info size={14} /> <span>Çeyza AVM Hakkında</span>
              </button>
            </div>

          </div>
        </div>

        {/* Main Branding & Search Navigation */}
        <div className="innovative-main-nav">
          <div className="container main-nav-container">
            
            {/* Logo */}
            <div className="brand-logo-area">
              <a href="#" onClick={(e) => { 
                e.preventDefault(); 
                handleSelectCategoryAndSubcat('all', 'all'); 
              }}>
                <img 
                  src="/resimler/ceyzalogobeyaz.png" 
                  alt="Çeyza Alışveriş Merkezleri" 
                  className="brand-logo-img" 
                />
              </a>
            </div>

            {/* Search Bar */}
            <div className="header-search-bar">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Süpürge, Airfryer, Buzdolabı, Nevresim, Halı arayın..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="header-quick-actions">
              
              {/* TAKSİT ÖDE BUTTON */}
              <button className="quick-action-btn" onClick={onOpenTaksit}>
                <div className="btn-icon-wrapper">
                  <CreditCard size={18} />
                </div>
                <div className="btn-text">
                  <span className="btn-label">Online İşlemler</span>
                  <span className="btn-title">Taksit Öde</span>
                </div>
              </button>

              <button className="quick-action-btn" onClick={onOpenCart}>
                <div className="btn-icon-wrapper">
                  <Heart size={18} />
                </div>
                <div className="btn-text">
                  <span className="btn-label">Favorilerim</span>
                  <span className="btn-title">Listem</span>
                </div>
              </button>

              <button className="quick-action-btn cart-btn-highlight" onClick={onOpenCart}>
                <div className="btn-icon-wrapper">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
                <div className="btn-text">
                  <span className="btn-label">Sepetim</span>
                  <span className="btn-title">{cartTotal.toLocaleString('tr-TR')} TL</span>
                </div>
              </button>

              {/* Mobile Hamburger Toggle Button */}
              <button 
                className="mobile-hamburger-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Mobil Menü"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer Modal */}
        {isMobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-drawer-header">
                <h3>Çeyza Menü</h3>
                <button className="mobile-drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Quick Actions Bar */}
              <div className="mobile-drawer-actions">
                <button className="mobile-action-card" onClick={() => { setIsMobileMenuOpen(false); onOpenTaksit(); }}>
                  <CreditCard size={18} />
                  <span>Taksit Öde</span>
                </button>
                <button className="mobile-action-card highlight" onClick={() => { setIsMobileMenuOpen(false); onOpenInfoModal('ask-question'); }}>
                  <MessageSquare size={18} />
                  <span>Soru Sor</span>
                </button>
              </div>

              {/* Mobile Category List Accordion */}
              <div className="mobile-category-list">
                <button 
                  className="mobile-cat-item main-cat-all"
                  onClick={() => {
                    handleSelectCategoryAndSubcat('all', 'all');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span>Tüm Ürünlerimiz</span>
                </button>

                {mainCategories.map((cat) => (
                  <div key={cat.id} className="mobile-cat-group">
                    <button 
                      className={`mobile-cat-item ${expandedMobileCat === cat.id ? 'expanded' : ''}`}
                      onClick={() => setExpandedMobileCat(expandedMobileCat === cat.id ? null : cat.id)}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown size={16} className="mobile-cat-arrow" />
                    </button>

                    {expandedMobileCat === cat.id && (
                      <div className="mobile-subcat-list">
                        <button 
                          className="mobile-subcat-all-btn"
                          onClick={() => {
                            handleSelectCategoryAndSubcat(cat.slug, 'all');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Tüm {cat.name} Ürünleri
                        </button>
                        {cat.subcategories.map((subGroup, sIdx) => (
                          <div key={sIdx} className="mobile-subgroup-block">
                            <span className="mobile-subgroup-title">{subGroup.title}</span>
                            {subGroup.items.map((subItem, iIdx) => (
                              <button 
                                key={iIdx}
                                className="mobile-subcat-item"
                                onClick={() => {
                                  handleSelectCategoryAndSubcat(cat.slug, subItem);
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                {subItem}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Footer Contacts */}
              <div className="mobile-drawer-footer">
                <a href="tel:08506441616" className="mobile-phone-link">
                  <Phone size={16} /> 0850 644 1616 (Müşteri Hizmetleri)
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Mega-Menu Category Bar */}
        <div className="innovative-category-bar">
          <div className="container category-bar-container">
            <ul className="category-list">
              
              <li className="category-item">
                <a 
                  href="#products" 
                  className={selectedCategory === 'all' ? 'active-cat' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectCategoryAndSubcat('all', 'all');
                  }}
                >
                  Tüm Ürünler
                </a>
              </li>

              {mainCategories.map((cat, catIdx) => (
                <li 
                  key={cat.id} 
                  className="category-item has-dropdown"
                  onMouseEnter={() => setActiveMegaMenu(cat.id)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <a 
                    href="#products"
                    className={selectedCategory === cat.slug ? 'active-cat' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectCategoryAndSubcat(cat.slug, 'all');
                    }}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown size={14} className="dropdown-arrow" />
                  </a>

                  {/* Mega Menu Dropdown */}
                  {activeMegaMenu === cat.id && (
                    <div className={`mega-menu-dropdown cols-${cat.subcategories.length} ${
                      catIdx <= 1 ? 'align-left' : catIdx === 2 ? 'align-center' : 'align-right'
                    }`}>
                      <div className="mega-menu-content">
                        <div className="mega-subcategories-grid">
                          {cat.subcategories.map((subGroup, idx) => (
                            <div key={idx} className="mega-subgroup">
                              <h4>{subGroup.title}</h4>
                              <ul>
                                {subGroup.items.map((subItem, itemIdx) => (
                                  <li key={itemIdx}>
                                    <a 
                                      href="#products" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSelectCategoryAndSubcat(cat.slug, subItem);
                                      }}
                                    >
                                      <ChevronRight size={12} /> {subItem}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </li>
              ))}

            </ul>
          </div>
        </div>

      </header>
      <div className="header-placeholder"></div>
    </div>
  );
}
