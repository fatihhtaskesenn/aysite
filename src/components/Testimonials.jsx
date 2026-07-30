import React from 'react';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const testimonialsData = [
  {
    name: 'Ahmet Yılmaz',
    title: 'CTO, Global Logistics A.Ş.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    comment: 'CEYZA ekibi ile çalışmak projemiz için en doğru karardı. Mikroservis mimarisi ve yapay zeka entegrasyonu sayesinde işlem sürelerimiz %40 kısaldı.',
    stars: 5
  },
  {
    name: 'Selin Demir',
    title: 'Ürün Direktörü, HealthTech',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    comment: 'Mobil uygulamamızın lansman sürecini zamanında ve sıfır hata ile tamamladık. Kullanıcı arayüzünün estetiği ve hızı gerçekten muazzam.',
    stars: 5
  },
  {
    name: 'Mert Kaya',
    title: 'Kurucu, PayStream SaaS',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    comment: 'Teknik yetkinliklerinin yanı sıra iletişimleri ve problem çözme yaklaşımları harikaydı. CEYZA ekibine projemize kattıkları değer için teşekkür ederiz.',
    stars: 5
  }
];

export default function Testimonials() {
  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <div className="badge">Referanslarımız</div>
          <h2>Müşterilerimizin <span className="text-gradient">Değerlendirmeleri</span></h2>
          <p>Birlikte dijital dönüşüm yolculuğuna çıktığımız iş ortaklarımızın tecrübeleri.</p>
        </div>

        <div className="testimonials-grid">
          {testimonialsData.map((item, idx) => (
            <div key={idx} className="glass-card testimonial-card">
              <div className="testimonial-quote-icon">
                <Quote size={28} />
              </div>
              <div className="stars">
                {[...Array(item.stars)].map((_, s) => (
                  <Star key={s} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="testimonial-text">"{item.comment}"</p>
              
              <div className="testimonial-author">
                <img src={item.avatar} alt={item.name} className="author-avatar" />
                <div>
                  <h4 className="author-name">{item.name}</h4>
                  <span className="author-title">{item.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
