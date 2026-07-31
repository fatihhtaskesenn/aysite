import React, { useState } from 'react';
import { CreditCard, X, Search, CheckCircle2, ShieldCheck, User, Phone, FileText } from 'lucide-react';
import './TaksitModal.css';

export default function TaksitModal({ isOpen, onClose }) {
  const [tcNo, setTcNo] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('search'); // 'search', 'results', 'success'
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearchInstallments = (e) => {
    e.preventDefault();
    if (!tcNo || !phone) {
      alert('Lütfen T.C. Kimlik No / Müşteri No ve Telefon numaranızı girin.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('results');
    }, 800);
  };

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1000);
  };

  const handleReset = () => {
    setStep('search');
    setTcNo('');
    setPhone('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="taksit-modal-card" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="taksit-icon-bg">
              <CreditCard size={22} />
            </div>
            <div>
              <h3>Çeyza AVM Taksit Ödeme</h3>
              <span>Mağaza Taksit & Senet Hesap Sorgulama</span>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="taksit-modal-body">
          
          {step === 'search' && (
            <form onSubmit={handleSearchInstallments} className="taksit-form">
              <p className="taksit-intro-text">
                Çeyza AVM mağazalarımızdan taksitle aldığınız ürünlerin kalan taksitlerini T.C. Kimlik numaranız veya müşteri numaranız ile anında sorgulayıp ödeyebilirsiniz.
              </p>

              <div className="form-group">
                <label><User size={14} /> T.C. Kimlik No veya Müşteri No *</label>
                <input 
                  type="text" 
                  required 
                  maxLength={11}
                  placeholder="11 haneli T.C. Kimlik numaranız..."
                  value={tcNo}
                  onChange={(e) => setTcNo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><Phone size={14} /> Cep Telefonu Numarası *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="taksit-security-note">
                <ShieldCheck size={16} className="text-emerald" />
                <span>256-Bit SSL güvenli 3D ödeme altyapısı</span>
              </div>

              <button type="submit" className="btn-taksit-submit" disabled={loading}>
                {loading ? 'Sorgulanıyor...' : 'Taksitlerimi Sorgula'}
              </button>
            </form>
          )}

          {step === 'results' && (
            <div className="taksit-results-view">
              <div className="customer-info-box">
                <div>
                  <strong>Müşteri:</strong> Sn. Ahmet Y***
                </div>
                <div>
                  <strong>T.C. No:</strong> {tcNo.substring(0, 3)}*****{tcNo.substring(8)}
                </div>
              </div>

              <div className="installment-summary-card">
                <div className="summary-row">
                  <span>Toplam Kalan Taksit Sayısı:</span>
                  <strong>3 Taksit</strong>
                </div>
                <div className="summary-row">
                  <span>Günü Gelen Taksit Tutarı:</span>
                  <strong className="text-rose font-bold">1.250,00 TL</strong>
                </div>
                <div className="summary-row">
                  <span>Son Ödeme Tarihi:</span>
                  <span>10 Ağustos 2026</span>
                </div>
              </div>

              <form onSubmit={handlePay} className="taksit-payment-form">
                <h4>Kredi Kartı ile Güvenli Öde</h4>
                
                <div className="form-group">
                  <label>Kart Üzerindeki İsim</label>
                  <input type="text" required placeholder="Ad Soyad..." defaultValue="Ahmet Yılmaz" />
                </div>

                <div className="form-group">
                  <label>Kart Numarası</label>
                  <input type="text" required maxLength={19} placeholder="4543 **** **** 1234" defaultValue="4543 1234 5678 1234" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Son Kullanma (AY/YIL)</label>
                    <input type="text" required placeholder="08/28" defaultValue="08/28" />
                  </div>
                  <div className="form-group">
                    <label>CVC Güvenlik Kodu</label>
                    <input type="text" required maxLength={4} placeholder="882" defaultValue="882" />
                  </div>
                </div>

                <div className="btn-actions-row">
                  <button type="button" className="btn-secondary" onClick={() => setStep('search')}>
                    Geri
                  </button>
                  <button type="submit" className="btn-taksit-submit" disabled={loading}>
                    {loading ? 'İşlem Yapılıyor...' : '1.250,00 TL Taksit Öde'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="taksit-success-view">
              <div className="success-icon-wrapper">
                <CheckCircle2 size={40} />
              </div>
              <h3>Taksit Ödemeniz Alındı!</h3>
              <p>1.250,00 TL tutarındaki taksit ödemeniz Çeyza AVM sistemine başarıyla işlenmiştir. İşlem dekontu SMS ve e-posta olarak iletilmiştir.</p>
              <button className="btn-taksit-submit" onClick={handleReset}>
                Başka Taksit Sorgula
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
