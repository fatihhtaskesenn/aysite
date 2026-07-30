import React from 'react';
import { X, ShoppingBag, ShieldCheck, MapPin, Award, CheckCircle2, Phone, Mail } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import './AboutModal.css';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="about-modal-content retail-card" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="about-header">
          <img src="/resimler/ceyzalogobeyaz.png" alt="Çeyza Alışveriş Merkezleri" className="about-logo-img" />
          <p className="about-subtitle">Ev Züccaciye, Tekstil, Halı, Beyaz Eşya ve Elektronikte Güvenin Adresi</p>
        </div>

        <div className="about-body">
          
          <div className="about-intro-box">
            <h3>Çeyza Alışveriş Merkezleri Hikayemiz</h3>
            <p>
              Çeyza AVM olarak, yıllardır perakendecilik sektöründe müşterilerimize en kaliteli markaları, en uygun fiyat ve taksit imkânlarıyla sunmanın gururunu yaşıyoruz. Fiziksel mağaza zincirlerimiz ve online e-ticaret platformumuz ile Türkiye'nin dört bir yanındaki ailelerin tüm ev ihtiyaçlarını tek çatı altında topluyoruz.
            </p>
          </div>

          <div className="about-highlights-grid">
            <div className="highlight-item">
              <div className="highlight-icon"><ShoppingBag size={22} /></div>
              <div>
                <strong>Geniş Ürün Yelpazesi</strong>
                <span>Züccaciyeden Beyaz Eşyaya, Halıdan Elektronike binlerce çeşit ürün.</span>
              </div>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon"><ShieldCheck size={22} /></div>
              <div>
                <strong>%100 Garanti & Orijinallik</strong>
                <span>Tüm ürünlerimiz resmi faturalı ve 2 Yıl marka garantilidir.</span>
              </div>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon"><MapPin size={22} /></div>
              <div>
                <strong>Fiziksel Mağazadan Teslimat</strong>
                <span>İster adresinize kargo, ister size en yakın Çeyza AVM'den hemen teslim alma imkânı.</span>
              </div>
            </div>

            <div className="highlight-item">
              <div className="highlight-icon"><Award size={22} /></div>
              <div>
                <strong>Kolay Ödeme & Taksit</strong>
                <span>Tüm kredi kartlarına peşin fiyatına 12 taksite varan fırsatlar.</span>
              </div>
            </div>
          </div>

          {/* Social Media Link Card */}
          <div className="about-social-card">
            <div className="social-card-left">
              <InstagramIcon size={36} className="insta-icon" />
              <div>
                <h4>Bizi Instagram'da Takip Edin</h4>
                <span>Sosyal medyaya özel çekilişler, yeni gelen ürünler ve sürpriz indirimler!</span>
              </div>
            </div>
            <a 
              href="https://www.instagram.com/ceyzavm/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary insta-follow-btn"
            >
              @ceyzavm Takip Et
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
