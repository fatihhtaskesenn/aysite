import React from 'react';
import { Cpu, Code2, Smartphone, Cloud, ShieldCheck, Palette, ArrowUpRight } from 'lucide-react';
import './Services.css';

const servicesData = [
  {
    icon: <Cpu size={32} />,
    title: 'Yapay Zeka & ML Çözümleri',
    description: 'İş süreçlerinizi otomatikleştiren, veri analitiği ve LLM tabanlı yapay zeka modelleri entegrasyonu.',
    tag: 'Popüler'
  },
  {
    icon: <Code2 size={32} />,
    title: 'Özel Web Yazılımları',
    description: 'Yüksek performanslı, ölçeklenebilir ve güvenli kurumsal web uygulamaları ve portal mimarileri.',
    tag: 'Kurumsal'
  },
  {
    icon: <Smartphone size={32} />,
    title: 'Mobil Uygulama Geliştirme',
    description: 'iOS ve Android platformları için akıcı, responsive ve yüksek etkileşimli yerel / hibrit uygulamalar.',
    tag: 'iOS & Android'
  },
  {
    icon: <Cloud size={32} />,
    title: 'Bulut Mimarisi & DevOps',
    description: 'AWS, GCP ve Azure üzerinde otomatik ölçeklenen, %99.99 erişilebilirlik sunan altyapı kurulumları.',
    tag: 'Cloud-Native'
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Siber Güvenlik Hizmetleri',
    description: 'Sistem sızma testleri, kod denetimleri ve uçtan uca veri güvenliği protokolleri uygulaması.',
    tag: 'Güvenlik'
  },
  {
    icon: <Palette size={32} />,
    title: 'UI/UX Tasarım & Ürün Stratejisi',
    description: 'Kullanıcı odaklı modern arayüzler, prototipler ve yüksek dönüşüm oranına sahip ürün tasarımları.',
    tag: 'Tasarım'
  }
];

export default function Services() {
  return (
    <section id="services" className="section services-section">
      <div className="container">
        <div className="section-header">
          <div className="badge">Hizmetlerimiz</div>
          <h2>Geleceğin Dijital Teknolojilerini <span className="text-gradient">Sunuyoruz</span></h2>
          <p>İhtiyaçlarınıza özel olarak tasarlanan, yüksek teknoloji odaklı uçtan uca yazılım çözümleri.</p>
        </div>

        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div key={index} className="glass-card service-card">
              <div className="service-header">
                <div className="service-icon">{service.icon}</div>
                <span className="service-tag">{service.tag}</span>
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <a href="#contact" className="service-link">
                Detaylı Bilgi <ArrowUpRight size={18} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
