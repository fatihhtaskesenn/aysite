import React from 'react';
import { ArrowRight, Cpu, ShieldCheck, Zap, Code2, Layers, CheckCircle2 } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-bg-glow pulse-glow"></div>
      <div className="container hero-container">
        
        <div className="hero-content">
          <div className="badge">
            <Cpu size={16} /> Yapay Zeka Destekli Dijital Dönüşüm
          </div>

          <h1 className="hero-title">
            Dijital Geleceğinizi <span className="text-gradient">CEYZA</span> ile Şekillendirin
          </h1>

          <p className="hero-description">
            Ölçeklenebilir bulut mimarisi, yapay zeka sistemleri, özel yazılımlar ve modern kullanıcı deneyimi tasarımı ile işinizi geleceğe taşıyoruz.
          </p>

          <div className="hero-cta-group">
            <a href="#contact" className="btn btn-primary">
              Projenizi Başlatın <ArrowRight size={18} />
            </a>
            <a href="#services" className="btn btn-secondary">
              Hizmetleri Keşfet
            </a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Tamamlanan Proje</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">%99.8</span>
              <span className="stat-label">Müşteri Memnuniyeti</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">7/24</span>
              <span className="stat-label">Teknik Destek</span>
            </div>
          </div>
        </div>

        <div className="hero-visual floating">
          <div className="hero-card-glass">
            <div className="card-header">
              <div className="dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="card-title">
                <Code2 size={16} /> ceyza-ai-core.config.js
              </div>
            </div>

            <div className="card-body">
              <pre className="code-block">
                <code>
                  <span className="code-keyword">const</span> <span className="code-var">ceyzaApp</span> = <span className="code-func">createEngine</span>(&#123;{'\n'}
                  {'  '}architecture: <span className="code-string">'Next-Gen AI & Cloud'</span>,{'\n'}
                  {'  '}securityLevel: <span className="code-string">'Enterprise Grade'</span>,{'\n'}
                  {'  '}performance: <span className="code-number">100</span>,{'\n'}
                  {'  '}scalability: <span className="code-string">'Auto-Scale Ultra'</span>{'\n'}
                  &#125;);{'\n\n'}
                  <span className="code-comment">// System status initialized</span>{'\n'}
                  <span className="code-keyword">await</span> ceyzaApp.<span className="code-func">deployToProduction</span>();
                </code>
              </pre>
            </div>

            <div className="card-footer">
              <div className="feature-pill">
                <CheckCircle2 size={16} className="text-cyan" /> Yüksek Performans
              </div>
              <div className="feature-pill">
                <Zap size={16} className="text-cyan" /> Ultra Hızlı Dağıtım
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
