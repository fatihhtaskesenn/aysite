import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, CreditCard, Lock, UserCheck, MessageSquare } from 'lucide-react';
import './Footer.css';

export default function Footer({ onOpenStores, onOpenAdmin, onOpenInfoModal, onOpenAbout, onOpenTaksit }) {
  return (
    <footer className="retail-footer">
      <div className="container">
        
        {/* Footer Top Info Bar */}
        <div className="footer-info-bar">
          <div className="info-bar-item">
            <ShieldCheck size={28} className="text-rose" />
            <div>
              <strong>%100 Orijinal Ürünler</strong>
              <span>Resmi faturalı ve 2 Yıl Garanti</span>
            </div>
          </div>

          <div className="info-bar-item">
            <CreditCard size={28} className="text-rose" />
            <div>
              <strong>Güvenli Ödeme & Taksit</strong>
              <span>256-Bit SSL ve tüm kartlara taksit</span>
            </div>
          </div>

          <div className="info-bar-item" onClick={onOpenStores} style={{ cursor: 'pointer' }}>
            <MapPin size={28} className="text-rose" />
            <div>
              <strong>Çeyza Mağazaları</strong>
              <span>Online al, mağazadan teslim al</span>
            </div>
          </div>
        </div>

        {/* Footer Links Columns */}
        <div className="footer-links-grid">
          
          <div className="footer-brand-col">
            <a href="#" className="footer-logo-link">
              <img src="/resimler/ceyzalogo.png" alt="Çeyza Mağazaları" className="footer-logo-img" />
            </a>
            <p className="footer-about">
              Küçük Ev Aletleri, Beyaz Eşya, Mutfak Ürünleri, Elektronik, Ev Tekstili, Kişisel Bakım ve Halı kategorilerinde kaliteli perakende çözümleri.
            </p>
            <div className="footer-contact-info">
              <p><Phone size={16} /> <strong>Müşteri Hizmetleri:</strong> 0850 644 1616</p>
              <p><Mail size={16} /> <strong>E-Posta:</strong> destek@ceyza.com.tr</p>
            </div>
          </div>

          <div className="footer-col">
            <h4>Alışveriş Kategorileri</h4>
            <ul>
              <li><a href="#products">Küçük Ev Aletleri (Süpürgeler, Airfryer)</a></li>
              <li><a href="#products">Beyaz Eşya & Ankastre</a></li>
              <li><a href="#products">Mutfak Ürünleri & Tencereler</a></li>
              <li><a href="#products">Elektronik & Smart TV</a></li>
              <li><a href="#products">Ev Tekstili & Nevresim</a></li>
              <li><a href="#products">Kişisel Bakım Cihazları</a></li>
              <li><a href="#products">Halılar (Bambu & Modern)</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Müşteri Hizmetleri</h4>
            <ul>
              <li><button className="footer-link-btn" onClick={() => onOpenInfoModal('order-track')}>Sipariş Takibi</button></li>
              <li><button className="footer-link-btn" onClick={() => onOpenInfoModal('returns')}>İade ve Değişim Şartları</button></li>
              <li><button className="footer-link-btn" onClick={() => onOpenInfoModal('warranty')}>Garanti ve Servis Prosedürü</button></li>
              <li><button className="footer-link-btn" onClick={onOpenStores}>Mağazalarımız ve Adresler</button></li>
              <li><button className="footer-link-btn" onClick={() => onOpenInfoModal('faq')}>Sıkça Sorulan Sorular (SSS)</button></li>
              <li><button className="footer-link-btn" onClick={onOpenTaksit}>Taksit Seçenekleri</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Kurumsal & Yasal</h4>
            <ul>
              <li><button className="footer-link-btn" onClick={onOpenAbout}>Hakkımızda</button></li>
              <li><button className="footer-link-btn" onClick={() => onOpenInfoModal('terms')}>Kullanım Koşulları</button></li>
              <li><button className="footer-link-btn" onClick={() => onOpenInfoModal('privacy')}>Gizlilik ve Çerez Politikası</button></li>
              <li><button className="footer-link-btn" onClick={() => onOpenInfoModal('kvkk')}>KVKK Aydınlatma Metni</button></li>
              <li><button className="footer-link-btn font-bold text-rose" onClick={() => onOpenInfoModal('ask-question')}>💬 İletişim / Bize Soru Sor</button></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Çeyza Perakende ve Mağazacılık A.Ş. Tüm hakları saklıdır.</p>
          
          <div className="payment-badges">
            <span className="payment-tag"><Lock size={14} /> 256-Bit SSL</span>
            <span className="payment-tag">Visa</span>
            <span className="payment-tag">Mastercard</span>
            <span className="payment-tag">Troy</span>
            <span className="payment-tag">Bonus</span>
            <span className="payment-tag">Maximum</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
