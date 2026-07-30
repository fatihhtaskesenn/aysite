import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { mainCategories, carpetFilters } from '../data/categories';
import { fetchProducts } from '../services/productService';
import { SlidersHorizontal, ArrowUpDown, Filter, RotateCcw, Check, Sparkles, PackageX, ChevronRight, ChevronDown, CheckSquare, Square, X } from 'lucide-react';
import './ProductSection.css';

export default function ProductSection({ 
  searchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  selectedSubcat = 'all',
  setSelectedSubcat,
  onAddToCart, 
  onQuickView, 
  refreshKey 
}) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  const [priceMax, setPriceMax] = useState(150000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCarpetSize, setSelectedCarpetSize] = useState('all');
  const [selectedCarpetMaterial, setSelectedCarpetMaterial] = useState('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch products from database
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchProducts({
        category: selectedCategory,
        subcategory: selectedSubcat !== 'all' ? selectedSubcat : null,
        searchQuery,
        priceRange: priceMax < 150000 ? priceMax : null,
        carpetSize: selectedCarpetSize !== 'all' ? selectedCarpetSize : null,
        carpetMaterial: selectedCarpetMaterial !== 'all' ? selectedCarpetMaterial : null
      });
      setProductList(res.data || []);
      setLoading(false);
    }
    loadData();
  }, [selectedCategory, selectedSubcat, searchQuery, priceMax, selectedCarpetSize, selectedCarpetMaterial, refreshKey]);

  // Extract unique brands from fetched products
  const availableBrands = useMemo(() => {
    const brands = new Set();
    productList.forEach(p => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [productList]);

  // Active Category details
  const currentCatObj = mainCategories.find(c => c.slug === selectedCategory);

  // Filter & Sort Products Logic
  const filteredProducts = useMemo(() => {
    return productList.filter(item => {
      // Price Filter
      if (priceMax < 150000 && item.price > priceMax) return false;
      // Stock Filter
      if (inStockOnly && !item.in_stock) return false;
      // Brand Filter
      if (selectedBrand !== 'all' && item.brand !== selectedBrand) return false;
      // Subcategory Filter (in-memory double check)
      if (selectedSubcat !== 'all' && item.subcategory !== selectedSubcat) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // recommended
    });
  }, [productList, priceMax, inStockOnly, selectedBrand, selectedSubcat, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    if (setSelectedSubcat) setSelectedSubcat('all');
    setPriceMax(150000);
    setInStockOnly(false);
    setSelectedBrand('all');
    setSelectedCarpetSize('all');
    setSelectedCarpetMaterial('all');
  };

  const hasActiveFilters = Boolean(
    selectedCategory !== 'all' || 
    selectedSubcat !== 'all' || 
    priceMax < 150000 || 
    inStockOnly || 
    selectedBrand !== 'all' ||
    selectedCarpetSize !== 'all' ||
    selectedCarpetMaterial !== 'all' ||
    searchQuery
  );

  return (
    <section className="product-section" id="products">
      <div className="container">
        
        {/* Section Header */}
        <div className="product-section-header">
          <div>
            {currentCatObj && (
              <h2 className="selected-cat-header-title">
                {currentCatObj.name}
                {selectedSubcat !== 'all' && ` - ${selectedSubcat}`}
              </h2>
            )}
          </div>

          <div className="header-controls">
            {/* Mobile Filter Toggle Button */}
            <button 
              className="btn-mobile-filter-toggle"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <Filter size={16} /> 
              <span>Filtreler {hasActiveFilters ? '(Aktif)' : ''}</span>
              <ChevronDown size={14} className={isMobileFilterOpen ? 'rotated' : ''} />
            </button>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-container">
              <ArrowUpDown size={16} className="sort-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="recommended">Sıralama: Önerilen</option>
                <option value="price-low">Fiyat: Düşükten Yükseğe</option>
                <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
                <option value="rating">En Yüksek Puanlılar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Summary Pills */}
        {hasActiveFilters && (
          <div className="active-filters-bar">
            <span className="active-filter-label"><Filter size={14} /> Aktif Filtreler:</span>
            
            {selectedCategory !== 'all' && (
              <span className="filter-pill">
                Kategori: {currentCatObj ? currentCatObj.name : selectedCategory}
                <X size={12} className="remove-pill" onClick={() => setSelectedCategory('all')} />
              </span>
            )}

            {selectedSubcat !== 'all' && (
              <span className="filter-pill">
                Alt Kategori: {selectedSubcat}
                <X size={12} className="remove-pill" onClick={() => setSelectedSubcat && setSelectedSubcat('all')} />
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="filter-pill">
                Marka: {selectedBrand}
                <X size={12} className="remove-pill" onClick={() => setSelectedBrand('all')} />
              </span>
            )}

            {priceMax < 150000 && (
              <span className="filter-pill">
                Maks: {priceMax.toLocaleString('tr-TR')} TL
                <X size={12} className="remove-pill" onClick={() => setPriceMax(150000)} />
              </span>
            )}

            {inStockOnly && (
              <span className="filter-pill">
                Sadece Stokta
                <X size={12} className="remove-pill" onClick={() => setInStockOnly(false)} />
              </span>
            )}

            <button className="btn-clear-all-pills" onClick={handleResetFilters}>
              Hepsini Temizle
            </button>
          </div>
        )}

        {/* Halı Özel Filtreleri (Sadece Halı kategorisinde seçili ise görünür) */}
        {selectedCategory === 'halilar' && (
          <div className="carpet-filter-panel">
            <div className="carpet-filter-group">
              <label>Halı Ölçüsü / Ebatı:</label>
              <select 
                value={selectedCarpetSize} 
                onChange={(e) => setSelectedCarpetSize(e.target.value)}
                className="carpet-select"
              >
                <option value="all">Tüm Ölçüler</option>
                {carpetFilters.sizes.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="carpet-filter-group">
              <label>Halı Materyali:</label>
              <select 
                value={selectedCarpetMaterial} 
                onChange={(e) => setSelectedCarpetMaterial(e.target.value)}
                className="carpet-select"
              >
                <option value="all">Tüm İplik/Kumaş Türleri</option>
                {carpetFilters.materials.map((m, idx) => (
                  <option key={idx} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {(selectedCarpetSize !== 'all' || selectedCarpetMaterial !== 'all') && (
              <button 
                className="btn-clear-carpet-filter"
                onClick={() => {
                  setSelectedCarpetSize('all');
                  setSelectedCarpetMaterial('all');
                }}
              >
                <RotateCcw size={14} /> Filtreleri Temizle
              </button>
            )}
          </div>
        )}

        {/* Main Grid Content */}
        <div className="product-layout-grid">
          
          {/* Left Sidebar Filters ("Sol Köşe") */}
          <aside className={`filter-sidebar ${isMobileFilterOpen ? 'mobile-show' : ''}`}>
            <div className="filter-card">
              
              <div className="filter-card-header">
                <h3><Filter size={18} /> Gelişmiş Filtreler</h3>
                {hasActiveFilters && (
                  <button className="btn-reset-filters" onClick={handleResetFilters}>
                    <RotateCcw size={14} /> Sıfırla
                  </button>
                )}
              </div>

              {/* Category Tree Navigation with Toggle Off & Shrink Support */}
              <div className="filter-group">
                <ul className="sidebar-cat-list">
                  <li>
                    <button 
                      className={`sidebar-cat-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory('all');
                        if (setSelectedSubcat) setSelectedSubcat('all');
                      }}
                    >
                      <span>Tüm Ürünler</span>
                    </button>
                  </li>

                  {mainCategories.map(cat => {
                    const isCatActive = selectedCategory === cat.slug;
                    return (
                      <li key={cat.id} className="sidebar-cat-item">
                        <button 
                          className={`sidebar-cat-btn ${isCatActive ? 'active' : ''}`}
                          onClick={() => {
                            if (isCatActive) {
                              // Clicking active category toggles it OFF (shrinks back to all)
                              setSelectedCategory('all');
                              if (setSelectedSubcat) setSelectedSubcat('all');
                            } else {
                              setSelectedCategory(cat.slug);
                              if (setSelectedSubcat) setSelectedSubcat('all');
                            }
                          }}
                        >
                          <span>{cat.name}</span>
                          {cat.subcategories && (
                            <ChevronRight size={14} className={`cat-chevron ${isCatActive ? 'expanded' : ''}`} />
                          )}
                        </button>

                        {/* Nested Subcategories in Left Sidebar */}
                        {isCatActive && cat.subcategories && (
                          <ul className="sidebar-subcat-list">
                            <li>
                              <button
                                className={`sidebar-subcat-btn ${selectedSubcat === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedSubcat && setSelectedSubcat('all')}
                              >
                                <span className="bullet-dot">•</span>
                                <span>Tüm {cat.name}</span>
                              </button>
                            </li>
                            {cat.subcategories.flatMap(sub => sub.items).map((itemStr, subIdx) => {
                              const isSubActive = selectedSubcat === itemStr;
                              return (
                                <li key={subIdx}>
                                  <button
                                    className={`sidebar-subcat-btn ${isSubActive ? 'active' : ''}`}
                                    onClick={() => {
                                      if (isSubActive) {
                                        // Clicking active subcategory toggles it OFF (back to all)
                                        if (setSelectedSubcat) setSelectedSubcat('all');
                                      } else {
                                        if (setSelectedSubcat) setSelectedSubcat(itemStr);
                                      }
                                    }}
                                  >
                                    <span className="bullet-dot">•</span>
                                    <span>{itemStr}</span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Stock Filter Toggle */}
              <div className="filter-group">
                <label className="checkbox-filter-label" onClick={() => setInStockOnly(!inStockOnly)}>
                  {inStockOnly ? (
                    <CheckSquare size={18} className="text-emerald" />
                  ) : (
                    <Square size={18} className="text-slate" />
                  )}
                  <span>Sadece Stokta Olan Ürünler</span>
                </label>
              </div>

              {/* Price Filter */}
              <div className="filter-group">
                <label className="filter-group-title">Maksimum Fiyat</label>
                <div className="price-slider-container">
                  <input 
                    type="range" 
                    min="500" 
                    max="150000" 
                    step="1000"
                    value={priceMax} 
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="price-range-slider"
                  />
                  <div className="price-display-box">
                    <span>0 TL</span>
                    <strong>{priceMax.toLocaleString('tr-TR')} TL</strong>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div className="filter-group">
                  <label className="filter-group-title">Markaya Göre Filtrele</label>
                  <select 
                    value={selectedBrand} 
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="brand-filter-select"
                  >
                    <option value="all">Tüm Markalar ({availableBrands.length})</option>
                    {availableBrands.map((b, idx) => (
                      <option key={idx} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

            </div>
          </aside>

          {/* Product Cards Grid */}
          <div className="products-display-area">
            
            {loading ? (
              <div className="loading-grid-spinner">
                <div className="spinner"></div>
                <p>Ürünler yükleniyor...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products-found">
                <PackageX size={56} className="text-slate" />
                <h3>Ürün Bulunamadı</h3>
                <p>Seçtiğiniz kriterlere uygun ürün bulunamadı veya henüz eklenmedi.</p>
                <button className="btn-reset-filters-large" onClick={handleResetFilters}>
                  Tüm Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="product-cards-grid">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
