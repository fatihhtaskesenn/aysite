import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { createQuestion } from '../services/questionService';
import './Contact.css';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setLoading(true);
      await createQuestion({
        name: formData.name,
        contact_info: formData.email,
        subject: formData.subject || 'Web İletişim Formu',
        question: formData.message
      });
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 6000);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <div className="contact-wrapper">
          
          <div className="contact-info-col">
            <div className="badge">Çeyza İletişim</div>
            <h2>Müşteri Hizmetleri <span className="text-gradient">& Destek Hattı</span></h2>
            <p>
              Çeyza Alışveriş Merkezleri ürünleri, taksitli/senetli satış imkanları ve siparişlerinizle ilgili her konuda bize anında ulaşabilirsiniz.
            </p>

            <div className="contact-methods">
              <div className="contact-method-card">
                <div className="method-icon"><Phone size={22} /></div>
                <div>
                  <span className="method-label">Müşteri Hizmetleri Çağrı Merkezi</span>
                  <a href="tel:08506441616" className="method-value">0850 644 1616</a>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="method-icon"><Mail size={22} /></div>
                <div>
                  <span className="method-label">E-Posta Desteği</span>
                  <a href="mailto:destek@ceyza.com.tr" className="method-value">destek@ceyza.com.tr</a>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="method-icon"><MapPin size={22} /></div>
                <div>
                  <span className="method-label">Merkez Mağaza & Yönetim</span>
                  <span className="method-value">Gazcılar Cad. No: 27, Osmangazi / Bursa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-col">
            <div className="glass-card contact-form-card">
              {submitted ? (
                <div className="success-message">
                  <CheckCircle size={48} className="text-cyan" />
                  <h3>Mesajınız Müşteri Hizmetlerine İletildi!</h3>
                  <p>Sorunuz yönetici panelimize ulaştı. Temsilcilerimiz en kısa sürede tarafınızla iletişime geçecektir.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3>💬 Bize Soru Sorun</h3>
                  
                  <div className="form-group">
                    <label htmlFor="name">Adınız Soyadınız *</label>
                    <input 
                      type="text" 
                      id="name" 
                      required 
                      placeholder="Örn: Ahmet Yılmaz"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Telefon Numarası veya E-Posta *</label>
                    <input 
                      type="text" 
                      id="email" 
                      required 
                      placeholder="0532 000 00 00 veya ahmet@sirketiniz.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Konu</label>
                    <input 
                      type="text" 
                      id="subject" 
                      placeholder="Örn: Taksitli Alışveriş Şartları"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Sorunuz / Mesajınız *</label>
                    <textarea 
                      id="message" 
                      rows="4" 
                      required 
                      placeholder="Öğrenmek istediğiniz detayları yazın..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary btn-submit" disabled={loading}>
                    <Send size={18} />
                    <span>{loading ? 'Gönderiliyor...' : 'Soruyu Müşteri Hizmetlerine Gönder'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
