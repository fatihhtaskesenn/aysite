import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Store, CheckCircle } from 'lucide-react';
import './CartDrawer.css';

import { createOrder } from '../services/orderService';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, cartTotal }) {
  const [deliveryMethod, setDeliveryMethod] = useState('shipping');
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const shippingThreshold = 500;
  const remainingForFreeShipping = Math.max(0, shippingThreshold - cartTotal);
  const shippingFee = cartTotal >= shippingThreshold || cartTotal === 0 || deliveryMethod === 'store' ? 0 : 49.90;
  const finalTotal = cartTotal + shippingFee;

  const handleCheckout = async () => {
    setIsSubmitting(true);
    const mockOrderNum = `CYZ-${Math.floor(100000 + Math.random() * 900000)}`;

    const result = await createOrder({
      full_name: 'Çeyza Müşterisi',
      phone: '05550000000',
      shipping_address: deliveryMethod === 'store' ? 'Mağazadan Teslim' : 'Bursa Müşteri Adresi',
      total_amount: finalTotal,
      payment_method: 'credit_card',
      items: cartItems
    });

    setOrderNumber(result.data?.id || mockOrderNum);
    setIsSubmitting(false);
    setCheckoutDone(true);

    setTimeout(() => {
      setCheckoutDone(false);
      onClose();
    }, 4500);
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-title">
            <ShoppingBag size={20} className="text-rose" />
            <h3>Alışveriş Sepetim</h3>
            <span className="cart-count-pill">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} Ürün</span>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {checkoutDone ? (
          <div className="checkout-success-view">
            <CheckCircle size={64} className="text-rose" />
            <h2>Siparişiniz Alındı!</h2>
            <p>Çeyza güvencesiyle siparişiniz hazırlanıyor. Sipariş numaranız: <strong>#CYZ-{Math.floor(100000 + Math.random() * 900000)}</strong></p>
            <span className="badge-installment">Faturanız e-posta adresinize gönderildi</span>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty-view">
            <ShoppingBag size={64} color="#cbd5e1" />
            <h4>Sepetiniz Henüz Boş</h4>
            <p>Çeyza ürün kataloğundan dilediğiniz ürünleri sepete ekleyebilirsiniz.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Alışverişe Başla
            </button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            <div className="free-shipping-box">
              {remainingForFreeShipping > 0 && deliveryMethod === 'shipping' ? (
                <p>Ücretsiz Kargo için <strong>{remainingForFreeShipping.toLocaleString('tr-TR')} TL</strong> daha ürün ekleyin!</p>
              ) : (
                <p className="text-emerald">🎉 Tebrikler! Siparişinizde <strong>Kargo Ücretsiz!</strong></p>
              )}
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.min(100, (cartTotal / shippingThreshold) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Delivery Method Selection */}
            <div className="delivery-selector">
              <button 
                className={`delivery-option ${deliveryMethod === 'shipping' ? 'active' : ''}`}
                onClick={() => setDeliveryMethod('shipping')}
              >
                <Truck size={18} /> Adrese Teslimat
              </button>
              <button 
                className={`delivery-option ${deliveryMethod === 'store' ? 'active' : ''}`}
                onClick={() => setDeliveryMethod('store')}
              >
                <Store size={18} /> Mağazadan Teslim Al
              </button>
            </div>

            {/* Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-info">
                    <span className="cart-item-brand">{item.brand}</span>
                    <h5 className="cart-item-name">{item.name}</h5>
                    
                    <div className="cart-item-bottom">
                      <div className="cart-quantity-box">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>

                      <span className="cart-item-price">
                        {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  </div>

                  <button className="cart-item-remove" onClick={() => onRemoveItem(item.id)} title="Sil">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="cart-drawer-footer">
              
              <div className="summary-row">
                <span>Ara Toplam</span>
                <strong>{cartTotal.toLocaleString('tr-TR')} TL</strong>
              </div>

              <div className="summary-row">
                <span>Kargo Ücreti</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald">ÜCRETSİZ</strong> : `${shippingFee.toFixed(2)} TL`}</span>
              </div>

              <div className="summary-row total-row">
                <span>Genel Toplam</span>
                <strong className="total-price">{finalTotal.toLocaleString('tr-TR')} TL</strong>
              </div>

              <div className="cart-checkout-actions">
                <button className="btn btn-primary checkout-btn" onClick={handleCheckout} disabled={isSubmitting}>
                  {isSubmitting ? 'İşleniyor...' : 'Siparişi Tamamla'} <ArrowRight size={18} />
                </button>

                <a 
                  href={`https://wa.me/908506441616?text=${encodeURIComponent(`Merhaba Çeyza AVM, sepetimdeki ürünler için sipariş vermek istiyorum:\n` + cartItems.map(i => `- ${i.name} (${i.quantity} Adet) - ${i.price * i.quantity} TL`).join('\n') + `\n\nToplam Tutarları: ${finalTotal.toLocaleString('tr-TR')} TL`)}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-whatsapp-checkout"
                >
                  💬 WhatsApp ile Hızlı Sipariş Ver
                </a>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
