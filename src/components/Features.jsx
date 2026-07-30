import React from 'react';
import { Layers, ShieldCheck, Zap, Server, RefreshCw, Headphones, Check } from 'lucide-react';
import './Features.css';

const featureList = [
  {
    icon: <Layers size={24} />,
    title: 'Modüler Mimariler',
    desc: 'Esnek, bakımı kolay ve ihtiyaçlarınıza göre hızla ölçeklenebilen mikroservis yapıları.'
  },
  {
    icon: <Zap size={24} />,
    title: 'Ultra Hızlı Reaksiyon',
    desc: 'Maksimum LCP ve Core Web Vitals skorları ile optimum kullanıcı deneyimi.'
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Üst Düzey Güvenlik',
    desc: 'ISO 27001 ve KVKK uyumlu, şifreli veri saklama ve uçtan uca koruma.'
  },
  {
    icon: <Server size={24} />,
    title: 'Bulut Entegrasyonu',
    desc: 'AWS ve Kubernetes üzerinde sorunsuz CI/CD otomasyonu ve yüksek erişilebilirlik.'
  },
  {
    icon: <RefreshCw size={24} />,
    title: 'Çevik (Agile) Süreçler',
    desc: 'Haftalık sprint güncellemeleri ve projenin her aşamasında şeffaf raporlama.'
  },
  {
    icon: <Headphones size={24} />,
    title: '7/24 Teknik Destek',
    desc: 'Canlı izleme sistemleri ve projeniz yayındayken de kesintisiz teknik destek.'
  }
];

export default function Features() {
  return (
    <section id="features" className="section features-section">
      <div className="container">
        <div className="features-wrapper">
          
          <div className="features-intro">
            <div className="badge">Neden CEYZA?</div>
            <h2>Teknoloji Standartlarını <span className="text-gradient">Yeniden Tanımlıyoruz</span></h2>
            <p>
              CEYZA olarak sadece kod yazmıyoruz; iş fikrinizi analiz ediyor, en doğru teknoloji mimarisini kurguluyor ve sürdürülebilir başarı için ölçeklendiriyoruz.
            </p>

            <ul className="check-list">
              <li><Check size={18} className="text-cyan" /> Deneyimli ve kıdemli mühendis kadrosu</li>
              <li><Check size={18} className="text-cyan" /> Sıfır toleranslı güvenlik ve performans prosedürleri</li>
              <li><Check size={18} className="text-cyan" /> Şeffaf iletişim ve zamanında teslimat garantisi</li>
            </ul>
          </div>

          <div className="features-grid">
            {featureList.map((item, idx) => (
              <div key={idx} className="glass-card feature-card">
                <div className="feature-icon">{item.icon}</div>
                <div>
                  <h4 className="feature-title">{item.title}</h4>
                  <p className="feature-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
