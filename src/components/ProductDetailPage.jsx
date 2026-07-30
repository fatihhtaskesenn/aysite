import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, ShoppingCart, ShieldCheck, Truck, Store, Check, 
  ChevronRight, Award, Clock, Heart, Share2, CreditCard, RefreshCw, FileText
} from 'lucide-react';
import './ProductDetailPage.css';

export default function ProductDetailPage({ product, onBack, onAddToCart, onOpenTaksit }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'desc' | 'warranty' | 'shipping'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  if (!product) return null;

  const discountPercent = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const monthlyInstallment = Math.round(product.price / 12);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        
        {/* Navigation / Breadcrumbs Row */}
        <div className="page-nav-row">
          <button className="btn-back-link" onClick={onBack}>
            <ArrowLeft size={18} /> Tüm Ürünlere Dön
          </button>

          <div className="detail-breadcrumb">
            <span onClick={onBack} className="crumb-link">Ana Sayfa</span>
            <ChevronRight size={13} />
            <span onClick={onBack} className="crumb-link">{product.category || 'Ürün Kataloğu'}</span>
            <ChevronRight size={13} />
            <span className="crumb-current">{product.name}</span>
          </div>
        </div>

        {/* Main Product Showcase Card */}
        <div className="product-showcase-card">
          <div className="showcase-grid">
            
            {/* Left Image Gallery & Trust Column */}
            <div className="showcase-image-col">
              <div className="product-hero-image">
                <img src={product.image} alt={product.name} />
                <div className="hero-badge-stack">
                  {discountPercent > 0 && (
                    <span className="badge-discount-lg">%{discountPercent} İNDİRİM</span>
                  )}
                  {product.badge && (
                    <span className="badge-tag-lg">
                      {typeof product.badge === 'string' ? product.badge.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() : String(product.badge)}
                    </span>
                  )}
                </div>
              </div>

              {/* High-End Trust Pillars */}
              <div className="trust-pillars-grid">
                <div className="pillar-item">
                  <Truck size={22} className="pillar-icon" />
                  <div>
                    <strong>Aynı Gün Kargo</strong>
                    <span>14:00 öncesi siparişlerde hızlı teslimat</span>
                  </div>
                </div>

                <div className="pillar-item">
                  <ShieldCheck size={22} className="pillar-icon" />
                  <div>
                    <strong>%100 Orijinal Ürün</strong>
                    <span>2 Yıl Resmi Distribütör Garantili</span>
                  </div>
                </div>

                <div className="pillar-item">
                  <Store size={22} className="pillar-icon" />
                  <div>
                    <strong>Mağazadan Teslim</strong>
                    <span>Bursa ve Kütahya şubelerimizden hazır alım</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Product Details & Buy Column */}
            <div className="showcase-details-col">
              
              <div className="detail-header-meta">
                <span className="detail-brand-badge">{product.brand}</span>
                <span className="detail-sku-code">STOK KODU: CYZ-{product.id || '9842'}</span>
              </div>

              <h1 className="detail-product-title">{product.name}</h1>

              {/* Rating & Reviews Bar */}
              <div className="detail-rating-row">
                <div className="stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.floor(product.rating || 5) ? "#f59e0b" : "#e2e8f0"} color="#f59e0b" />
                  ))}
                </div>
                <span className="rating-score">{product.rating || 4.9}</span>
                <span className="rating-divider">•</span>
                <span className="rating-reviews">({product.reviewCount || 18} Doğrulanmış Müşteri Yorumu)</span>
              </div>

              {/* Price & Installment Card */}
              <div className="detail-price-card">
                {product.originalPrice > product.price && (
                  <span className="detail-original-price">{product.originalPrice.toLocaleString('tr-TR')} TL</span>
                )}
                
                <div className="detail-current-price-row">
                  <span className="detail-current-price">{product.price.toLocaleString('tr-TR')} TL</span>
                  <span className="detail-vat-badge">KDV Dahil</span>
                </div>

                {/* Taksit & Senet Hesaplayıcı Kutu */}
                <div className="detail-installment-box">
                  <div className="installment-icon-box">
                    <CreditCard size={20} />
                  </div>
                  <div className="installment-info">
                    <strong>Kredi Kartına veya Senetle 12 Taksit</strong>
                    <span>Aylık Sadece <strong>{monthlyInstallment.toLocaleString('tr-TR')} TL</strong> ödeme fırsatı</span>
                  </div>
                  <button className="btn-calc-taksit" onClick={onOpenTaksit}>
                    Taksit Seçenekleri
                  </button>
                </div>
              </div>

              {/* Short Summary Description */}
              <p className="detail-short-desc">
                {product.description || 'Çeyza Alışveriş Merkezleri güvencesiyle sunulan bu ürün, dayanıklı yapısı, üstün performansı ve estetik tasarımı ile yaşam alanlarınıza değer katar.'}
              </p>

              {/* Quantity & Add to Cart Actions */}
              <div className="detail-buy-actions">
                <div className="detail-qty-picker">
                  <label className="qty-label">Adet:</label>
                  <div className="qty-controls">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                <button className="btn-detail-add-cart" onClick={handleAdd}>
                  {added ? <Check size={20} /> : <ShoppingCart size={20} />}
                  {added ? 'SEPETE EKLENDİ!' : 'SEPETE EKLE'}
                </button>
              </div>

              {/* Stock Status Bar */}
              <div className="detail-stock-status">
                <span className="stock-dot"></span>
                <span><strong>Stok Durumu:</strong> Ürün Merkez Depomuzda Hazır ve Gönderime Uygundur.</span>
              </div>

            </div>

          </div>

          {/* Bottom Tabs Section: Specifications, Full Description & Returns */}
          <div className="detail-tabs-section">
            <div className="tabs-header-nav">
              <button 
                className={`tab-nav-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                <Award size={18} /> Teknik Özellikler
              </button>

              <button 
                className={`tab-nav-btn ${activeTab === 'desc' ? 'active' : ''}`}
                onClick={() => setActiveTab('desc')}
              >
                <FileText size={18} /> Detaylı Ürün Açıklaması
              </button>

              <button 
                className={`tab-nav-btn ${activeTab === 'warranty' ? 'active' : ''}`}
                onClick={() => setActiveTab('warranty')}
              >
                <ShieldCheck size={18} /> Garanti ve İade Şartları
              </button>
            </div>

            <div className="tab-pane-container">
              {activeTab === 'specs' && (
                <div className="specs-full-grid">
                  <div className="spec-row"><span className="spec-label">Ürün Markası</span><span className="spec-value">{product.brand}</span></div>
                  <div className="spec-row"><span className="spec-label">Model Kodu</span><span className="spec-value">CYZ-{product.id || '9842'}</span></div>
                  <div className="spec-row"><span className="spec-label">Stok Durumu</span><span className="spec-value text-green">✓ Stokta Mevcut</span></div>
                  <div className="spec-row"><span className="spec-label">Garanti Tipi</span><span className="spec-value">24 Ay Resmi Distribütör Garantili</span></div>
                  <div className="spec-row"><span className="spec-label">Kargo Teslimatı</span><span className="spec-value">500 TL Üzeri Ücretsiz Kargo</span></div>
                  {product.specs && Object.entries(product.specs).map(([k, v], idx) => (
                    <div key={idx} className="spec-row">
                      <span className="spec-label">{k}</span>
                      <span className="spec-value">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'desc' && (
                <div className="desc-full-text">
                  <h3>{product.name} Hakkında</h3>
                  <p>{product.description}</p>
                  <p>Çeyza AVM mağazalarımızda ve internet sitemizde satışa sunulan tüm ürünler %100 orijinal, ambalajlı ve faturası adınıza düzenlenerek kargolanır. Bursa ve Kütahya şubelerimiz üzerinden de elden teslimat ve senetle taksit imkanından yararlanabilirsiniz.</p>
                </div>
              )}

              {activeTab === 'warranty' && (
                <div className="warranty-full-text">
                  <h3>Garanti, Değişim ve İade Koşulları</h3>
                  <p>Satın aldığınız ürünler 24 ay boyunca T.C. Ticaret Bakanlığı onaylı orijinal distribütör garantisi kapsamındadır. Ürünü teslim aldığınız tarihten itibaren 14 gün içerisinde orijinal kutusuna hasar vermeden koşulsuz iade hakkınız bulunmaktadır.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
