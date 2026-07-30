import React from 'react';
import { mainCategories } from '../data/categories';
import { ChevronRight } from 'lucide-react';
import './CategoryGrid.css';

export default function CategoryGrid({ onSelectCategory }) {
  return (
    <section className="section category-grid-section">
      <div className="container">
        
        <div className="section-header">
          <div>
            <h2>Kategorilere Göre <span style={{ color: 'var(--accent-rose)' }}>Alışveriş Yapın</span></h2>
            <p>Evinizin ve hayatınızın tüm ihtiyaçları için Çeyza ürün kategorileri.</p>
          </div>
        </div>

        <div className="category-cards-grid">
          {mainCategories.map((cat) => (
            <div 
              key={cat.id} 
              className="category-card"
              onClick={() => onSelectCategory(cat.slug)}
            >
              <div className="category-card-img">
                <img src={cat.bannerImg} alt={cat.name} loading="lazy" />
                <div className="category-overlay" />
              </div>
              <div className="category-card-info">
                <h3>{cat.name}</h3>
                <span className="sub-count">{cat.subcategories.reduce((acc, curr) => acc + curr.items.length, 0)} Ürün Grubu</span>
                <span className="explore-btn">
                  Keşfet <ChevronRight size={16} />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
