import React, { useState } from 'react';
import { ExternalLink, Code2, Sparkles } from 'lucide-react';
import './Portfolio.css';

const projectsData = [
  {
    title: 'FinTech AI Analiz Platformu',
    category: 'Yapay Zeka',
    tech: ['React', 'Node.js', 'Python', 'OpenAI'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    desc: 'Finansal piyasalar için gerçek zamanlı duygu analizi ve tahminleme yapan AI dashboard uygulaması.'
  },
  {
    title: 'Lojistik & Filo Takip Portalı',
    category: 'SaaS & Web',
    tech: ['Next.js', 'PostgreSQL', 'Docker', 'AWS'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop',
    desc: 'Büyük ölçekli lojistik firmaları için GPS entegrasyonlu ve canlı rota optimizasyonu sağlayan filo portalı.'
  },
  {
    title: 'MedTech Mobil Sağlık Uygulaması',
    category: 'Mobil',
    tech: ['React Native', 'Firebase', 'GraphQL'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    desc: 'Hasta ve doktor iletişimini kolaylaştıran, randevu ve reçete takip özellikli mobil sağlık platformu.'
  },
  {
    title: 'E-Ticaret Omnichannel Altyapısı',
    category: 'SaaS & Web',
    tech: ['React', 'Tailwind', 'Microservices'],
    image: 'https://images.unsplash.com/photo-1556742049-0a67d577c731?q=80&w=800&auto=format&fit=crop',
    desc: 'Yüksek trafikli e-ticaret markaları için özel tasarım ve hızlı ödeme altyapısı çözümü.'
  }
];

export default function Portfolio() {
  const [filter, setFilter] = useState('Tümü');

  const filteredProjects = filter === 'Tümü' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="section portfolio-section">
      <div className="container">
        <div className="section-header">
          <div className="badge">Projelerimiz</div>
          <h2>Başarıyla Tamamlanan <span className="text-gradient">Çözümler</span></h2>
          <p>Farklı sektörlerden lider markalara ürettiğimiz yenilikçi ve yüksek performanslı yazılımlar.</p>
        </div>

        <div className="portfolio-filter">
          {['Tümü', 'Yapay Zeka', 'SaaS & Web', 'Mobil'].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredProjects.map((project, idx) => (
            <div key={idx} className="glass-card project-card">
              <div className="project-image-wrapper">
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="project-overlay">
                  <a href="#contact" className="project-action-btn">
                    <ExternalLink size={20} /> Projeyi İncele
                  </a>
                </div>
              </div>

              <div className="project-info">
                <div className="project-category">{project.category}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
                <div className="project-tech-tags">
                  {project.tech.map((t, i) => (
                    <span key={i} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
