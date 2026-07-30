import React from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="retail-card product-card">
      
      {/* Top Badges */}
      <div className="product-card-badges">
        {discountPercent > 0 && (
          <span className="badge-discount">%{discountPercent} İNDİRİM</span>
        )}
        {product.badge && (
          <span className="badge-tag">
            {typeof product.badge === 'string' ? product.badge.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() : String(product.badge)}
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button className="card-favorite-btn" aria-label="Favorilere Ekle">
        <Heart size={18} />
      </button>

      {/* Image Container */}
      <div className="product-image-container" onClick={() => onQuickView(product)}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <button className="quick-view-btn">
          <Eye size={16} /> Ürün Detayları
        </button>
      </div>

      {/* Info Container */}
      <div className="product-info-container">
        <div className="product-brand">{product.brand}</div>
        <h4 className="product-name" onClick={() => onQuickView(product)}>
          {product.name}
        </h4>

        {/* Rating Stars */}
        <div className="product-rating">
          <div className="stars-row">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "#f59e0b" : "#e2e8f0"} color="#f59e0b" />
            ))}
          </div>
          <span className="rating-val">{product.rating}</span>
          <span className="rating-count">({product.reviewCount})</span>
        </div>

        {/* Installment Badge */}
        {product.installment && (
          <div className="installment-bar">
            <span className="badge-installment">{product.installment}</span>
          </div>
        )}

        {/* Price & Cart CTA */}
        <div className="product-card-bottom">
          <div className="product-price-box">
            {product.originalPrice > product.price && (
              <span className="original-price">{product.originalPrice.toLocaleString('tr-TR')} TL</span>
            )}
            <span className="current-price">{product.price.toLocaleString('tr-TR')} TL</span>
          </div>

          <button className="btn btn-primary add-cart-btn" onClick={() => onAddToCart(product)}>
            <ShoppingCart size={18} /> Sepete Ekle
          </button>
        </div>

      </div>
    </div>
  );
}
