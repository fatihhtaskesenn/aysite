import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, Package, ShoppingCart, Store, MessageSquare, Plus, Edit2, Trash2, 
  Search, Check, X, ShieldAlert, ArrowLeft, RefreshCw, Upload, Image as ImageIcon, Sparkles, Tag, Flame, CheckSquare, Square, Layers, DollarSign, FileText, Layout
} from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../services/productService';
import { fetchAllOrders, updateOrderStatus } from '../services/orderService';
import { fetchHeroBanners, createHeroBanner, updateHeroBanner, deleteHeroBanner } from '../services/heroService';
import { fetchQuestions, updateQuestionStatus, deleteQuestion } from '../services/questionService';
import { officialStores } from './StoreLocatorModal';
import { mainCategories } from '../data/categories';
import './AdminPanel.css';

// Preset Campaign Badges
const PRESET_BADGES = [
  '🔥 Fırsat Ürünü',
  '⚡ Peşin Fiyatına Taksit',
  '✨ Efsane İndirim',
  '🎁 Çeyiz Paketi Fırsatı',
  '🏷️ %20 İNDİRİM',
  '🚚 Ücretsiz Kargo',
  '💎 Özel Dokuma'
];

export default function AdminPanel({ onExitAdmin }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [rlsErrorNotice, setRlsErrorNotice] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [productForm, setProductForm] = useState({
    title: '',
    category: 'kucuk-ev-aletleri',
    subcategory: '',
    price: '',
    originalPrice: '',
    image: '',
    badge: '🔥 Fırsat Ürünü',
    isDeal: true,
    description: '',
    size: '',
    material: '',
    inStock: true
  });

  // Hero Banner Modal State
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [heroForm, setHeroForm] = useState({
    title: '',
    image: '',
    is_active: true
  });
  const [heroUploading, setHeroUploading] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    const prodRes = await fetchProducts();
    setProducts(prodRes.data || []);

    const orderRes = await fetchAllOrders();
    setOrders(orderRes.data || []);

    const heroRes = await fetchHeroBanners();
    setHeroBanners(heroRes.data || []);

    const qRes = await fetchQuestions();
    setQuestions(qRes.data || []);

    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'ceyzavm2716') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Hatalı yönetici şifresi! Lütfen tekrar deneyin.');
    }
  };

  // Handle Product File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const uploadRes = await uploadProductImage(file);
    if (uploadRes.url) {
      setProductForm(prev => ({ ...prev, image: uploadRes.url }));
    } else {
      alert('Görsel yüklenirken bir sorun oluştu.');
    }
    setImageUploading(false);
  };

  // Handle Hero File Upload
  const handleHeroFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setHeroUploading(true);
    const uploadRes = await uploadProductImage(file);
    if (uploadRes.url) {
      setHeroForm(prev => ({ ...prev, image: uploadRes.url }));
    } else {
      alert('Görsel yüklenirken bir sorun oluştu.');
    }
    setHeroUploading(false);
  };

  // Product CRUD Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setRlsErrorNotice(null);
    const firstCat = mainCategories[0];
    const firstSub = firstCat.subcategories[0]?.items[0] || '';
    setProductForm({
      title: '',
      category: firstCat.slug,
      subcategory: firstSub,
      price: '',
      originalPrice: '',
      image: '',
      badge: '🔥 Fırsat Ürünü',
      isDeal: true,
      description: '',
      size: '',
      material: '',
      inStock: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setRlsErrorNotice(null);
    setProductForm({
      title: product.title || product.name || '',
      category: product.category || 'kucuk-ev-aletleri',
      subcategory: product.subcategory || '',
      price: product.price || '',
      originalPrice: product.originalPrice || product.old_price || '',
      image: product.image || '',
      badge: product.badge || '',
      isDeal: Boolean(product.is_deal || product.isDeal || (product.badge && product.badge.includes('Fırsat'))),
      description: product.description || '',
      size: product.size || '',
      material: product.material || '',
      inStock: product.inStock !== false
    });
    setIsProductModalOpen(true);
  };

  const handleToggleDealStatus = async (product) => {
    const newDealStatus = !Boolean(product.is_deal || product.isDeal || (product.badge && product.badge.includes('Fırsat')));
    const updatedBadge = newDealStatus ? '🔥 Fırsat Ürünü' : product.badge;

    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_deal: newDealStatus, isDeal: newDealStatus, badge: updatedBadge } : p));

    await updateProduct(product.id, {
      is_deal: newDealStatus,
      badge: updatedBadge
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setRlsErrorNotice(null);

    if (!productForm.image) {
      alert('Lütfen bir ürün resmi seçin veya resim bağlantısı girin.');
      setFormSubmitting(false);
      return;
    }

    if (editingProduct) {
      const updatedList = products.map(p => p.id === editingProduct.id ? { ...p, ...productForm, is_deal: productForm.isDeal } : p);
      setProducts(updatedList);
      setIsProductModalOpen(false);

      const res = await updateProduct(editingProduct.id, {
        title: productForm.title,
        name: productForm.title,
        category: productForm.category,
        subcategory: productForm.subcategory,
        price: Number(productForm.price),
        original_price: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        image: productForm.image,
        badge: productForm.badge || '',
        is_deal: productForm.isDeal,
        description: productForm.description,
        size: productForm.size,
        material: productForm.material,
        in_stock: productForm.inStock
      });

      const errMsg = typeof res?.error === 'string' ? res.error : (res?.error?.message || '');
      if (errMsg.includes('row-level security')) {
        setRlsErrorNotice(errMsg);
      }
    } else {
      const tempId = `temp-${Date.now()}`;
      const newTempProduct = {
        id: tempId,
        ...productForm,
        is_deal: productForm.isDeal,
        created_at: new Date().toISOString()
      };
      setProducts([newTempProduct, ...products]);
      setIsProductModalOpen(false);

      const res = await createProduct({
        title: productForm.title,
        name: productForm.title,
        category: productForm.category,
        subcategory: productForm.subcategory,
        price: Number(productForm.price),
        original_price: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        image: productForm.image,
        badge: productForm.badge || '',
        is_deal: productForm.isDeal,
        description: productForm.description,
        size: productForm.size,
        material: productForm.material,
        in_stock: productForm.inStock
      });

      const createErrMsg = typeof res?.error === 'string' ? res.error : (res?.error?.message || '');
      if (createErrMsg.includes('row-level security')) {
        setRlsErrorNotice(createErrMsg);
      }
    }
    setFormSubmitting(false);
  };

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`"${title}" adlı ürünü silmek istediğinize emin misiniz?`)) {
      setProducts(products.filter(p => p.id !== id));
      await deleteProduct(id);
    }
  };

  // Hero Banner Handlers
  const handleOpenAddHeroModal = () => {
    setEditingHero(null);
    setHeroForm({
      title: '',
      image: '',
      is_active: true
    });
    setIsHeroModalOpen(true);
  };

  const handleOpenEditHeroModal = (hero) => {
    setEditingHero(hero);
    setHeroForm({
      title: hero.title || '',
      image: hero.image || '',
      is_active: hero.is_active !== false
    });
    setIsHeroModalOpen(true);
  };

  const handleSaveHeroBanner = async (e) => {
    e.preventDefault();
    if (!heroForm.image) {
      alert('Lütfen kampanya afiş görselini seçin veya bir bağlantı girin.');
      return;
    }

    const payload = {
      title: heroForm.title.trim() || 'Kampanya Afişi',
      image: heroForm.image,
      is_active: heroForm.is_active
    };

    if (editingHero) {
      const updated = heroBanners.map(b => b.id === editingHero.id ? { ...b, ...payload } : b);
      setHeroBanners(updated);
      setIsHeroModalOpen(false);
      await updateHeroBanner(editingHero.id, payload);
    } else {
      const res = await createHeroBanner(payload);
      if (res.data) {
        setHeroBanners(prev => [...prev, res.data]);
      }
      setIsHeroModalOpen(false);
    }
  };

  const handleDeleteHeroBanner = async (id, title) => {
    if (window.confirm(`"${title || 'Bu kampanya afişini'}" silmek istediğinize emin misiniz?`)) {
      setHeroBanners(prev => prev.filter(b => b.id !== id));
      await deleteHeroBanner(id);
    }
  };

  const handleToggleHeroStatus = async (hero) => {
    const newStatus = !hero.is_active;
    setHeroBanners(prev => prev.map(b => b.id === hero.id ? { ...b, is_active: newStatus } : b));
    await updateHeroBanner(hero.id, { is_active: newStatus });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatus(orderId, newStatus);
  };

  const handleToggleQuestionStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'answered' : 'pending';
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    await updateQuestionStatus(id, newStatus);
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Bu müşteri sorusunu silmek istediğinize emin misiniz?')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      await deleteQuestion(id);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.subcategory || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const selectedCatObj = mainCategories.find(c => c.slug === productForm.category);
  const availableSubcategories = selectedCatObj ? selectedCatObj.subcategories.flatMap(s => s.items) : [];

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="login-logo-area">
            <div className="logo-red-badge">
              <img src="/resimler/ceyzalogobeyaz.png" alt="Çeyza AVM Logo" className="login-logo-img" />
            </div>
            <h2>Yönetici Giriş Paneli</h2>
            <p>Çeyza Alışveriş Merkezleri Yönetim Sistemi</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label><Lock size={15} /> Admin Şifreniz</label>
              <input 
                type="password" 
                required 
                placeholder="Yönetici şifresini girin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                autoFocus
              />
            </div>

            {loginError && <div className="login-error-alert">{loginError}</div>}

            <button type="submit" className="btn-admin-login">
              Sisteme Giriş Yap
            </button>

            <button type="button" className="btn-back-site" onClick={onExitAdmin}>
              <ArrowLeft size={16} /> Siteye Geri Dön
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="admin-dashboard-container">
      
      {/* Header Bar */}
      <header className="admin-header-nav">
        <div className="admin-nav-brand">
          <div className="logo-red-badge-small">
            <img src="/resimler/ceyzalogobeyaz.png" alt="Çeyza Logo" />
          </div>
          <span className="admin-badge-title">GÜVENLİ YÖNETİM PANELİ</span>
        </div>

        <div className="admin-nav-actions">
          <button className="btn-return-store" onClick={onExitAdmin}>
            <ArrowLeft size={16} /> Mağazaya Dön
          </button>
          <button className="btn-logout" onClick={() => setIsAuthenticated(false)}>
            <LogOut size={16} /> Güvenli Çıkış
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="admin-main-content">
        <div className="container">
          
          {/* Tabs Navigation */}
          <div className="admin-tabs-bar">
            <button 
              className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} /> Ürün Yönetimi ({products.length})
            </button>

            <button 
              className={`admin-tab-btn ${activeTab === 'hero' ? 'active' : ''}`}
              onClick={() => setActiveTab('hero')}
            >
              <Sparkles size={18} /> Hero Kampanya Afişleri ({heroBanners.length})
            </button>

            <button 
              className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart size={18} /> Gelen Siparişler ({orders.length})
            </button>

            <button 
              className={`admin-tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              <MessageSquare size={18} /> Müşteri Soruları ({questions.length})
            </button>

            <button 
              className={`admin-tab-btn ${activeTab === 'stores' ? 'active' : ''}`}
              onClick={() => setActiveTab('stores')}
            >
              <Store size={18} /> Mağaza Şubelerimiz ({officialStores.length})
            </button>
          </div>

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="products-admin-section">
              <div className="admin-controls-bar">
                <div className="admin-search-box">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Ürün adı veya alt kategori ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="admin-cat-select"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {mainCategories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>

                <button className="btn-admin-add" onClick={handleOpenAddModal}>
                  <Plus size={18} /> Yeni Ürün Ekle
                </button>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Görsel</th>
                      <th>Ürün Adı</th>
                      <th>Kategori</th>
                      <th>Alt Kategori</th>
                      <th>Fiyat</th>
                      <th>Fırsat Ürünü</th>
                      <th>Rozet</th>
                      <th>Durum</th>
                      <th style={{ textAlign: 'right' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="9" style={{ textAlign: 'center', padding: '3rem' }}>
                          <p style={{ fontWeight: 600, color: '#64748b' }}>Veritabanında henüz ürün bulunmuyor.</p>
                          <button className="btn-admin-add" onClick={handleOpenAddModal} style={{ marginTop: '1rem' }}>
                            <Plus size={16} /> İlk Ürünü Ekle
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(product => {
                        const isDeal = Boolean(product.is_deal || product.isDeal || (product.badge && product.badge.includes('Fırsat')));
                        return (
                          <tr key={product.id}>
                            <td>
                              <img src={product.image} alt={product.title} className="table-thumb" />
                            </td>
                            <td>
                              <strong className="product-table-title">{product.title || product.name}</strong>
                            </td>
                            <td>
                              <span className="cat-pill">{product.category}</span>
                            </td>
                            <td>{product.subcategory || '-'}</td>
                            <td>
                              <div className="price-stack">
                                <strong>{Number(product.price).toLocaleString('tr-TR')} TL</strong>
                                {product.originalPrice && <del>{Number(product.originalPrice).toLocaleString('tr-TR')} TL</del>}
                              </div>
                            </td>
                            <td>
                              <button 
                                className={`deal-toggle-btn ${isDeal ? 'active' : ''}`}
                                onClick={() => handleToggleDealStatus(product)}
                                title="Fırsat Ürünü Vitrininde Göster / Kaldır"
                              >
                                <Flame size={14} />
                                <span>{isDeal ? 'Fırsat Ürünü' : 'Normal'}</span>
                              </button>
                            </td>
                            <td>
                              {product.badge ? <span className="badge-tag">{product.badge}</span> : '-'}
                            </td>
                            <td>
                              <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                                {product.inStock ? 'Stokta Var' : 'Tükendi'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="action-buttons-cell">
                                <button className="btn-action edit" onClick={() => handleOpenEditModal(product)} title="Düzenle">
                                  <Edit2 size={16} />
                                </button>
                                <button className="btn-action delete" onClick={() => handleDeleteProduct(product.id, product.title || product.name)} title="Sil">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HERO BANNERS TAB */}
          {activeTab === 'hero' && (
            <div className="hero-admin-section">
              <div className="admin-controls-bar">
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    Hero Section Kampanya Afişleri ({heroBanners.length})
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Anasayfada 3D geçen ekranlarda sergilenecek kampanya görsellerini buradan ekleyip düzenleyebilirsiniz.
                  </p>
                </div>

                <button className="btn-admin-add" onClick={handleOpenAddHeroModal}>
                  <Plus size={18} /> Yeni Kampanya Afişi Ekle
                </button>
              </div>

              {/* Hero Banner Grid Cards */}
              <div className="hero-banners-admin-grid">
                {heroBanners.length === 0 ? (
                  <div className="no-banners-box">
                    <p>Henüz kampanya afişi eklenmedi.</p>
                    <button className="btn-admin-add" onClick={handleOpenAddHeroModal} style={{ marginTop: '1rem' }}>
                      <Plus size={16} /> İlk Kampanya Afişini Ekle
                    </button>
                  </div>
                ) : (
                  heroBanners.map(hero => (
                    <div key={hero.id} className="hero-banner-admin-card">
                      <div className="hero-card-img-wrap">
                        <img src={hero.image} alt={hero.title} />
                        <span className={`hero-status-pill ${hero.is_active ? 'active' : 'inactive'}`}>
                          {hero.is_active ? 'Aktif Vitrinde' : 'Yayından Kaldırıldı'}
                        </span>
                      </div>

                      <div className="hero-card-details">
                        <h4>{hero.title || 'Kampanya Afişi'}</h4>
                        <div className="hero-card-actions">
                          <button 
                            className={`btn-action-hero-toggle ${hero.is_active ? 'active' : ''}`}
                            onClick={() => handleToggleHeroStatus(hero)}
                          >
                            {hero.is_active ? 'Vitrinden Kaldır' : 'Vitrine Al'}
                          </button>
                          <button className="btn-action edit" onClick={() => handleOpenEditHeroModal(hero)} title="Düzenle">
                            <Edit2 size={16} />
                          </button>
                          <button className="btn-action delete" onClick={() => handleDeleteHeroBanner(hero.id, hero.title)} title="Sil">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="orders-admin-section">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sipariş Kodu</th>
                      <th>Müşteri</th>
                      <th>Telefon</th>
                      <th>Teslimat</th>
                      <th>Tutar</th>
                      <th>Durum</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                          Henüz sipariş bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.id}>
                          <td><strong>#{order.code || order.id.substring(0, 6)}</strong></td>
                          <td>{order.customer_name}</td>
                          <td>{order.customer_phone}</td>
                          <td>{order.delivery_method}</td>
                          <td><strong>{order.total_amount?.toLocaleString('tr-TR')} TL</strong></td>
                          <td>
                            <span className={`order-status ${order.status}`}>
                              {order.status === 'pending' ? 'Hazırlanıyor' : 'Tamamlandı'}
                            </span>
                          </td>
                          <td>
                            {order.status === 'pending' && (
                              <button 
                                className="btn-complete-order"
                                onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                              >
                                <Check size={14} /> Tamamla
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* QUESTIONS TAB */}
          {activeTab === 'questions' && (
            <div className="questions-admin-section">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Müşteri Adı</th>
                      <th>İletişim Bilgisi</th>
                      <th>Konu</th>
                      <th>Sorulan Soru</th>
                      <th>Tarih</th>
                      <th>Durum</th>
                      <th style={{ textAlign: 'right' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                          Henüz müşteri sorusu bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      questions.map(q => (
                        <tr key={q.id}>
                          <td><strong>{q.name}</strong></td>
                          <td>{q.contact_info}</td>
                          <td><span className="cat-pill">{q.subject}</span></td>
                          <td style={{ maxWidth: '320px', lineHeight: '1.4' }}>{q.question}</td>
                          <td>{new Date(q.created_at || Date.now()).toLocaleDateString('tr-TR')}</td>
                          <td>
                            <span className={`order-status ${q.status === 'answered' ? 'completed' : 'pending'}`}>
                              {q.status === 'answered' ? 'Yanıtlandı' : 'Bekliyor'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="action-buttons-cell">
                              <button 
                                className={`btn-action-hero-toggle ${q.status === 'answered' ? 'active' : ''}`}
                                onClick={() => handleToggleQuestionStatus(q.id, q.status)}
                              >
                                {q.status === 'answered' ? 'Bekliyor Yap' : 'Yanıtlandı İşaretle'}
                              </button>
                              <button 
                                className="btn-action delete" 
                                onClick={() => handleDeleteQuestion(q.id)} 
                                title="Sil"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'stores' && (
            <div className="stores-admin-grid">
              {officialStores.map(store => (
                <div key={store.id} className="admin-store-card">
                  <span className="store-city">{store.city}</span>
                  <h4>{store.name}</h4>
                  <p>{store.address}</p>
                  <span>📞 {store.phone}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* ULTRA-MODERN PRODUCT EDIT / ADD MODAL */}
      {isProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="product-form-modal modern-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modern-modal-header">
              <div className="modal-title-stack">
                <div className="modal-header-icon-ring">
                  <Package size={22} />
                </div>
                <div>
                  <h3>{editingProduct ? 'Ürün Bilgilerini Düzenle' : 'Yeni Ürün Tanımla'}</h3>
                  <p>Çeyza AVM mağazası ve Fırsat Vitrinleriniz için ürün verilerini girin.</p>
                </div>
              </div>
              <button className="modern-modal-close" onClick={() => setIsProductModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="modern-product-form">
              <div className="form-card-section">
                <div className="section-card-title">
                  <Package size={17} /> <span>1. Temel Ürün Bilgileri</span>
                </div>

                <div className="form-group">
                  <label className="modern-label">Ürün Adı / Başlığı *</label>
                  <input 
                    type="text" 
                    required 
                    className="modern-input"
                    placeholder="Örn: Dyson V15 Detect Kablosuz Süpürge" 
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="modern-label">Ana Kategori *</label>
                    <select 
                      className="modern-select"
                      value={productForm.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const catObj = mainCategories.find(c => c.slug === newCat);
                        const firstSub = catObj?.subcategories[0]?.items[0] || '';
                        setProductForm({ ...productForm, category: newCat, subcategory: firstSub });
                      }}
                    >
                      {mainCategories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="modern-label">Alt Kategori *</label>
                    {availableSubcategories.length > 0 ? (
                      <select
                        className="modern-select"
                        value={productForm.subcategory}
                        onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                      >
                        {availableSubcategories.map((sub, i) => (
                          <option key={i} value={sub}>{sub}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        className="modern-input"
                        placeholder="Alt Kategori Yazın"
                        value={productForm.subcategory}
                        onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                      />
                    )}
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="modern-label">Satış Fiyatı (TL) *</label>
                    <div className="input-with-symbol">
                      <input 
                        type="number" 
                        required 
                        className="modern-input"
                        placeholder="24999" 
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      />
                      <span className="currency-tag">₺</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="modern-label">Eski / Çizili Fiyat (TL) (Opsiyonel)</label>
                    <div className="input-with-symbol">
                      <input 
                        type="number" 
                        className="modern-input"
                        placeholder="28999 (Boş bırakabilirsiniz)" 
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      />
                      <span className="currency-tag">₺</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-card-section">
                <div className="section-card-title">
                  <Flame size={17} /> <span>2. Vitrin Gösterimi & Kampanya Etiketi</span>
                </div>

                <div 
                  className={`modern-deal-toggle-card ${productForm.isDeal ? 'active-deal' : ''}`}
                  onClick={() => setProductForm({ ...productForm, isDeal: !productForm.isDeal })}
                >
                  <div className="toggle-icon-wrap">
                    <Flame size={22} className="flame-icon-svg" />
                  </div>
                  <div className="toggle-text-wrap">
                    <strong>Haftanın Fırsat Ürünleri Vitrininde Göster</strong>
                    <p>Bu seçeneği işaretlediğinizde ürün doğrudan anasayfa Fırsat Ürünleri döngüsünde sergilenir.</p>
                  </div>
                  <div className="switch-toggle-pill">
                    <span className="switch-thumb"></span>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="modern-label">Kampanya Rozeti Seçimi (Opsiyonel)</label>
                  
                  <div className="modern-badge-chips-grid">
                    <button 
                      type="button" 
                      className={`modern-badge-chip ${!productForm.badge ? 'active-chip' : ''}`}
                      onClick={() => setProductForm({ ...productForm, badge: '' })}
                    >
                      🚫 Rozet Yok (Temiz)
                    </button>
                    {PRESET_BADGES.map((b, i) => (
                      <button 
                        key={i} 
                        type="button" 
                        className={`modern-badge-chip ${productForm.badge === b ? 'active-chip' : ''}`}
                        onClick={() => {
                          // Toggle on/off if clicked again
                          setProductForm({ ...productForm, badge: productForm.badge === b ? '' : b });
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <input 
                    type="text" 
                    className="modern-input mt-2"
                    placeholder="Veya Özel Rozet Metni (Boş Bırakılabilir)..." 
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-card-section">
                <div className="section-card-title">
                  <ImageIcon size={17} /> <span>3. Görsel Yükleme & Açıklama</span>
                </div>

                <div className="form-group">
                  <label className="modern-label">Ürün Görseli *</label>
                  <div className="modern-upload-dropzone">
                    <label className="modern-file-btn">
                      <Upload size={18} color="#ffffff" />
                      <span>{imageUploading ? 'Görsel Yükleniyor...' : 'Bilgisayardan Dosya Yükle'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        disabled={imageUploading}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <div className="upload-divider">
                      <span>VEYA GÖRSEL LİNKİ</span>
                    </div>

                    <input 
                      type="text" 
                      className="modern-input"
                      placeholder="https://images.unsplash.com/photo-..." 
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    />
                  </div>

                  {productForm.image && (
                    <div className="modern-image-preview-card">
                      <img src={productForm.image} alt="Önizleme" />
                      <div className="preview-info">
                        <span className="preview-badge">Yüklendi</span>
                        <p>Görsel önizlemesi doğrulandı.</p>
                      </div>
                      <button 
                        type="button" 
                        className="btn-clear-img" 
                        onClick={() => setProductForm({ ...productForm, image: '' })}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="modern-label">Ürün Açıklaması</label>
                  <textarea 
                    rows={3} 
                    className="modern-textarea"
                    placeholder="Ürün özelliklerini açıklayın..." 
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modern-modal-actions">
                <button type="button" className="modern-btn-cancel" onClick={() => setIsProductModalOpen(false)}>
                  İptal
                </button>
                <button type="submit" className="modern-btn-submit" disabled={formSubmitting}>
                  <Check size={18} />
                  <span>{formSubmitting ? 'Kaydediliyor...' : editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Kaydet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ULTRA-MODERN HERO BANNER EDIT / ADD MODAL */}
      {isHeroModalOpen && (
        <div className="modal-overlay" onClick={() => setIsHeroModalOpen(false)}>
          <div className="product-form-modal modern-modal-card" onClick={(e) => e.stopPropagation()}>
            
            <div className="modern-modal-header">
              <div className="modal-title-stack">
                <div className="modal-header-icon-ring">
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3>{editingHero ? 'Hero Kampanya Afişini Düzenle' : 'Yeni Hero Kampanya Afişi Ekle'}</h3>
                  <p>Anasayfa 3D geçen ekranlarda sergilenecek görsel afişi yükleyin.</p>
                </div>
              </div>
              <button className="modern-modal-close" onClick={() => setIsHeroModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveHeroBanner} className="modern-product-form">
              
              <div className="form-card-section">
                <div className="section-card-title">
                  <ImageIcon size={17} /> <span>1. Kampanya Afiş Bilgileri</span>
                </div>

                <div className="form-group">
                  <label className="modern-label">Afiş / Kampanya Başlığı (Opsiyonel)</label>
                  <input 
                    type="text" 
                    className="modern-input"
                    placeholder="Örn: 100 TL Taksitle Fırsat Ürünleri (Boş bırakabilirsiniz)" 
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="modern-label">Afiş Görseli (Bilgisayardan Seç veya Link Gir) *</label>
                  
                  <div className="modern-upload-dropzone">
                    <label className="modern-file-btn">
                      <Upload size={18} color="#ffffff" />
                      <span>{heroUploading ? 'Afiş Yükleniyor...' : 'Bilgisayardan Afiş Seç'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleHeroFileChange}
                        disabled={heroUploading}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <div className="upload-divider">
                      <span>VEYA GÖRSEL URL LİNKİ</span>
                    </div>

                    <input 
                      type="text" 
                      className="modern-input"
                      placeholder="https://images.unsplash.com/... Veya /resimler/..." 
                      value={heroForm.image}
                      onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                    />
                  </div>

                  {heroForm.image && (
                    <div className="hero-modal-preview-box">
                      <img src={heroForm.image} alt="Afiş Önizleme" />
                      <div className="preview-info">
                        <span className="preview-badge">Afiş Yüklendi</span>
                        <p>Görsel orantılı sığdırma ve bulanık arka plan ile uyumludur.</p>
                      </div>
                      <button 
                        type="button" 
                        className="btn-clear-img" 
                        onClick={() => setHeroForm({ ...heroForm, image: '' })}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="modern-modal-actions">
                <button type="button" className="modern-btn-cancel" onClick={() => setIsHeroModalOpen(false)}>
                  İptal
                </button>
                <button type="submit" className="modern-btn-submit">
                  <Check size={18} />
                  <span>{editingHero ? 'Afişi Güncelle' : 'Afişi Yayınla'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
