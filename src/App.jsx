import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import DealsCarousel from './components/DealsCarousel';
import ProductSection from './components/ProductSection';
import ProductDetailPage from './components/ProductDetailPage';
import CartDrawer from './components/CartDrawer';
import StoreLocatorModal from './components/StoreLocatorModal';
import AboutModal from './components/AboutModal';
import TaksitModal from './components/TaksitModal';
import InfoModal from './components/InfoModal';
import AdminPanel from './components/AdminPanel';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('ceyza_cart_items');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ceyza_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Cart save error:', e);
    }
  }, [cartItems]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isTaksitModalOpen, setIsTaksitModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalTab, setInfoModalTab] = useState('ask-question');

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcat, setSelectedSubcat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL change detection for /admin or #admin
  useEffect(() => {
    const handleLocationCheck = () => {
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setIsAdminView(true);
      }
    };
    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);
    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
    };
  }, []);

  const handleExitAdmin = () => {
    setIsAdminView(false);
    setRefreshKey(prev => prev + 1);
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    if (window.location.pathname === '/admin') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleSelectCategory = (catSlug) => {
    setSelectedCategory(catSlug);
    setSelectedSubcat('all');
    setQuickViewProduct(null);
  };

  const handleOpenInfoModal = (tabName = 'ask-question') => {
    setInfoModalTab(tabName);
    setIsInfoModalOpen(true);
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.title || product.name,
        brand: product.brand || 'Çeyza AVM',
        price: product.price,
        image: product.image,
        quantity: 1
      }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (isAdminView) {
    return <AdminPanel onExitAdmin={handleExitAdmin} />;
  }

  return (
    <div className="retail-app">
      
      {/* Dynamic Header */}
      <Header 
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenStores={() => setIsStoreModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenTaksit={() => setIsTaksitModalOpen(true)}
        onOpenInfoModal={handleOpenInfoModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleSelectCategory}
        selectedSubcat={selectedSubcat}
        setSelectedSubcat={setSelectedSubcat}
      />

      {/* Main Content Areas */}
      <main>
        {quickViewProduct ? (
          <ProductDetailPage 
            product={quickViewProduct}
            onBack={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
            onOpenTaksit={() => setIsTaksitModalOpen(true)}
          />
        ) : (
          <>
            {selectedCategory === 'all' && !searchQuery && (
              <>
                <HeroBanner onCategorySelect={handleSelectCategory} />
                <DealsCarousel 
                  onAddToCart={handleAddToCart} 
                  onQuickView={(prod) => setQuickViewProduct(prod)} 
                />
              </>
            )}

            <ProductSection 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleSelectCategory}
              selectedSubcat={selectedSubcat}
              setSelectedSubcat={setSelectedSubcat}
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setQuickViewProduct(prod)}
              refreshKey={refreshKey}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer 
        onCategorySelect={handleSelectCategory} 
        onOpenStores={() => setIsStoreModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenTaksit={() => setIsTaksitModalOpen(true)}
        onOpenInfoModal={handleOpenInfoModal}
        onOpenAdmin={() => {
          setIsAdminView(true);
          window.location.hash = 'admin';
        }}
      />

      {/* Slide-over & Modals */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        cartTotal={cartTotal}
      />

      <StoreLocatorModal 
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />

      <AboutModal 
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      <TaksitModal 
        isOpen={isTaksitModalOpen}
        onClose={() => setIsTaksitModalOpen(false)}
      />

      <InfoModal 
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        initialTab={infoModalTab}
      />

    </div>
  );
}
