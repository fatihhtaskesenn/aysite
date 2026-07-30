import React, { useState } from 'react';
import { 
  X, Star, ShoppingCart, ShieldCheck, Truck, Store, Check, 
  ChevronRight, Award, Clock, Heart, Share2, Info
} from 'lucide-react';
import './ProductModal.css';

export default function ProductModal({ product, onClose, onAddToCart, onOpenTaksit }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'desc' | 'warranty'

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content retail-card product-detail-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Top Bar / Breadcrumb */}
        <div className="product-modal-topbar">
          <div className="modal-breadcrumb">
            <span>Çeyza AVM</span>
            <ChevronRight size={13} />
            <span>{product.category || 'Ürün Kataloğu'}</span>
            <ChevronRight size={13} />
            <span className="current-title">{product.name}</span>
          </div>
          
          <button className="modal-close-btn" onClick={onClose} title="Kapat">
            <X size={20} />
          </button>
        </div>

        <div className="product-modal-grid">
          
          {/* Left Column: Image & Badges */}
          <div className="modal-image-col">
            <div className="modal-main-image">
              <img src={product.image} alt={product.name} />
              <div className="modal-badge-stack">
                {discountPercent > 0 && (
                  <span className="badge-discount">%{discountPercent} İNDİRİM</span>
                )}
                {product.badge && (
                  <span className="badge-tag">{product.badge.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()}</span>
                )}
              </div>
            </div>

            {/* Trust Badges below image */}
            <div className="modal-trust-bar">
              <div className="trust-item">
                <Truck size={16} className="trust-icon" />
                <div>
                  <strong>Aynı Gün Kargo</strong>
                  <span>14:00 öncesi siparişlerde</span>
                </div>
              </div>
              <div className="trust-item">
                <ShieldCheck size={16} className="trust-icon" />
                <div>
                  <strong>%100 Orijinal Ürün</strong>
                  <span>2 Yıl Resmi Garanti</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="modal-details-col">
            
            <div className="modal-header-meta">
              <span className="product-brand">{product.brand}</span>
              <span className="product-sku">Stok Kod: CYZ-{product.id || '8841'}</span>
            </div>

            <h1 className="modal-product-title">{product.name}</h1>

            {/* Rating & Review */}
            <div className="product-rating">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating || 5) ? "#f59e0b" : "#e2e8f0"} color="#f59e0b" />
                ))}
              </div>
              <span className="rating-val">{product.rating || 4.9}</span>
              <span className="rating-count">({product.reviewCount || 12} Müşteri Değerlendirmesi)</span>
            </div>

            {/* Price Box */}
            <div className="modal-price-box">
              {product.originalPrice > product.price && (
                <span className="original-price">{product.originalPrice.toLocaleString('tr-TR')} TL</span>
              )}
              <div className="current-price-row">
                <span className="modal-current-price">{product.price.toLocaleString('tr-TR')} TL</span>
                <span className="price-vat-tag">(KDV Dahil)</span>
              </div>

              {/* Installment Badge Box */}
              <div className="installment-calculation-box">
                <div className="calc-info">
                  <strong>Senetle veya Kredi Kartına 12 Taksit:</strong>
                  <span>Aylık Sadece <strong>{monthlyInstallment.toLocaleString('tr-TR')} TL</strong></span>
                </div>
              </div>
            </div>

            {/* Description Short */}
            <p className="modal-description">{product.description}</p>

            {/* Tabs for Specs / Description / Warranty */}
            <div className="modal-tabs-header">
              <button 
                className={`modal-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Özellikler
              </button>
              <button 
                className={`modal-tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
                onClick={() => setActiveTab('desc')}
              >
                Detaylı Açıklama
              </button>
              <button 
                className={`modal-tab-btn ${activeTab === 'warranty' ? 'active' : ''}`}
                onClick={() => setActiveTab('warranty')}
              >
                Garanti & İade
              </button>
            </div>

            <div className="modal-tab-content">
              {activeTab === 'specs' && (
                <div className="specs-grid">
                  <div className="spec-item"><span className="spec-key">Marka:</span> <span className="spec-val">{product.brand}</span></div>
                  <div className="spec-item"><span className="spec-key">Stok Durumu:</span> <span className="spec-val text-green">✓ Stokta Var</span></div>
                  <div className="spec-item"><span className="spec-key">Garanti Süresi:</span> <span className="spec-val">24 Ay Resmi Distribütör</span></div>
                  <div className="spec-item"><span className="spec-key">Kargo:</span> <span className="spec-val">Ücretsiz Kargo</span></div>
                  {product.specs && Object.entries(product.specs).map(([key, val], idx) => (
                    <div key={idx} className="spec-item">
                      <span className="spec-key">{key}:</span>
                      <span className="spec-val">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'desc' && (
                <div className="tab-text">
                  <p>{product.description || 'Çeyza Alışveriş Merkezleri güvencesiyle sunulan bu ürün, yüksek malzeme kalitesi ve uzun ömürlü kullanım garantisiyle evinize konfor katar.'}</p>
                </div>
              )}

              {activeTab === 'warranty' && (
                <div className="tab-text">
                  <p>Bu ürün <strong>Çeyza AVM</strong> ve yetkili distribütör garantisi altındadır. Ambalajı bozulmamış ürünleri 14 gün içerisinde koşulsuz iade edebilir veya mağazalarımızdan birebir değişim yapabilirsiniz.</p>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="modal-actions-row">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button className="btn btn-primary modal-add-btn" onClick={handleAdd}>
                {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                {added ? 'Sepete Eklendi!' : 'Sepete Ekle'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
