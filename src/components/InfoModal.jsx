import React, { useState, useEffect } from 'react';
import { 
  X, Search, Truck, RefreshCw, ShieldCheck, HelpCircle, FileText, Lock, Shield, Info,
  MessageSquare, Phone, Mail, MapPin, Send, CheckCircle2, Clock, PackageCheck, AlertCircle
} from 'lucide-react';
import { createQuestion } from '../services/questionService';
import { fetchAllOrders } from '../services/orderService';
import './InfoModal.css';

export default function InfoModal({ isOpen, onClose, initialTab = 'ask-question' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Order Tracking Form State
  const [orderQuery, setOrderQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState(null);
  const [orderSearchAttempted, setOrderSearchAttempted] = useState(false);

  // Ask Question Form State
  const [questionForm, setQuestionForm] = useState({
    name: '',
    contact_info: '',
    subject: 'Genel Bilgi & Soru',
    question: ''
  });
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [questionSubmitting, setQuestionSubmitting] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  // Handle Order Search
  const handleSearchOrder = async (e) => {
    e.preventDefault();
    setOrderSearchAttempted(true);
    setFoundOrder(null);

    const q = orderQuery.trim().toLowerCase();
    if (!q) return;

    const res = await fetchAllOrders();
    const allOrders = res.data || [];

    const matched = allOrders.find(o => 
      (o.code && o.code.toLowerCase().includes(q)) || 
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.customer_phone && o.customer_phone.includes(q))
    );

    if (matched) {
      setFoundOrder(matched);
    }
  };

  // Handle Submit Question
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.name || !questionForm.contact_info || !questionForm.question) {
      alert('Lütfen adınızı, iletişim bilginizi ve sorunuzu doldurun.');
      return;
    }

    setQuestionSubmitting(true);
    await createQuestion(questionForm);
    setQuestionSubmitting(false);
    setQuestionSubmitted(true);
    setQuestionForm({ name: '', contact_info: '', subject: 'Genel Bilgi & Soru', question: '' });
  };

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="info-modal-header">
          <div className="info-header-title">
            <div className="info-badge-icon">
              <MessageSquare size={22} />
            </div>
            <div>
              <h3>Çeyza AVM Müşteri Hizmetleri & Bilgi Merkezi</h3>
              <p>Çağrı Merkezi: <strong>0850 644 1616</strong> | Çalışma Saatleri: 09:00 - 20:00</p>
            </div>
          </div>
          <button className="info-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Layout */}
        <div className="info-modal-body">
          
          {/* Sidebar Nav Tabs */}
          <div className="info-sidebar-nav">
            <div className="nav-group-title">Müşteri Hizmetleri</div>
            
            <button 
              className={`info-nav-item ${activeTab === 'ask-question' ? 'active' : ''}`}
              onClick={() => setActiveTab('ask-question')}
            >
              <MessageSquare size={17} /> 💬 Bize Soru Sor
            </button>

            <button 
              className={`info-nav-item ${activeTab === 'order-track' ? 'active' : ''}`}
              onClick={() => setActiveTab('order-track')}
            >
              <Truck size={17} /> Sipariş Takibi
            </button>

            <button 
              className={`info-nav-item ${activeTab === 'returns' ? 'active' : ''}`}
              onClick={() => setActiveTab('returns')}
            >
              <RefreshCw size={17} /> İade ve Değişim
            </button>

            <button 
              className={`info-nav-item ${activeTab === 'warranty' ? 'active' : ''}`}
              onClick={() => setActiveTab('warranty')}
            >
              <ShieldCheck size={17} /> Garanti ve Servis
            </button>

            <button 
              className={`info-nav-item ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <HelpCircle size={17} /> Sıkça Sorulan Sorular
            </button>

            <div className="nav-group-title mt-3">Kurumsal & Yasal</div>

            <button 
              className={`info-nav-item ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <Info size={17} /> 🏢 Biz Kimiz & Hakkımızda
            </button>

            <button 
              className={`info-nav-item ${activeTab === 'terms' ? 'active' : ''}`}
              onClick={() => setActiveTab('terms')}
            >
              <FileText size={17} /> Kullanım Koşulları
            </button>

            <button 
              className={`info-nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <Lock size={17} /> Gizlilik & Çerez Politikası
            </button>

            <button 
              className={`info-nav-item ${activeTab === 'kvkk' ? 'active' : ''}`}
              onClick={() => setActiveTab('kvkk')}
            >
              <Shield size={17} /> KVKK Aydınlatma Metni
            </button>
          </div>

          {/* Main Content Area */}
          <div className="info-tab-content-area">
            
            {/* 💬 BIZE SORU SOR TAB */}
            {activeTab === 'ask-question' && (
              <div className="tab-pane">
                <div className="pane-title">
                  <h2>💬 Çeyza AVM'ye Soru Sorun</h2>
                  <p>Ürünlerimiz, senetli satış, siparişiniz veya mağazalarımız hakkında aklınıza takılan her şeyi sorun. Müşteri temsilcilerimiz en kısa sürede yanıtlasın.</p>
                </div>

                {questionSubmitted ? (
                  <div className="question-success-box">
                    <CheckCircle2 size={48} className="text-emerald" />
                    <h3>Sorunuz Başarıyla İletildi!</h3>
                    <p>Müşteri temsilcilerimiz sorunuzu inceleyip tarafınızla en kısa sürede irtibata geçecektir. Teşekkür ederiz.</p>
                    <button 
                      className="btn-new-question"
                      onClick={() => setQuestionSubmitted(false)}
                    >
                      Yeni Bir Soru Gönder
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitQuestion} className="ask-question-form">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="info-label">Adınız Soyadınız *</label>
                        <input 
                          type="text" 
                          required 
                          className="info-input"
                          placeholder="Örn: Mustafa Yılmaz"
                          value={questionForm.name}
                          onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="info-label">Telefon Numarası veya E-Posta *</label>
                        <input 
                          type="text" 
                          required 
                          className="info-input"
                          placeholder="Örn: 0532 000 00 00 veya destek@ceyza.com"
                          value={questionForm.contact_info}
                          onChange={(e) => setQuestionForm({ ...questionForm, contact_info: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="info-label">Soru Konusu</label>
                      <select 
                        className="info-select"
                        value={questionForm.subject}
                        onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })}
                      >
                        <option value="Peşin Fiyatına Taksit & Senet">Peşin Fiyatına Taksit & Senet Alışverişi</option>
                        <option value="Ürün Bilgisi & Stok">Ürün Özellikleri & Stok Durumu</option>
                        <option value="Sipariş & Teslimat">Sipariş Durumu & Mağazadan Teslimat</option>
                        <option value="İade & Garanti">İade, Değişim & Servis Süreçleri</option>
                        <option value="Genel Bilgi & Soru">Diğer Genel Konular</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="info-label">Sorunuz / Mesajınız *</label>
                      <textarea 
                        rows={4} 
                        required 
                        className="info-textarea"
                        placeholder="Lütfen öğrenmek istediğiniz detayları buraya yazın..."
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                      />
                    </div>

                    <div className="form-footer-action">
                      <button type="submit" className="btn-send-question" disabled={questionSubmitting}>
                        <Send size={18} />
                        <span>{questionSubmitting ? 'Gönderiliyor...' : 'Soruyu Müşteri Hizmetlerine Gönder'}</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="quick-contact-strip">
                  <div className="contact-strip-item">
                    <Phone size={18} />
                    <div>
                      <span>Müşteri Hizmetleri Hatı</span>
                      <strong>0850 644 1616</strong>
                    </div>
                  </div>
                  <div className="contact-strip-item">
                    <Mail size={18} />
                    <div>
                      <span>E-Posta Desteği</span>
                      <strong>destek@ceyza.com.tr</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 📦 SIPARIS TAKIBI TAB */}
            {activeTab === 'order-track' && (
              <div className="tab-pane">
                <div className="pane-title">
                  <h2>📦 Canlı Sipariş Durumu Sorgulama</h2>
                  <p>Çeyza AVM mağazalarımızdan veya sitemiz üzerinden verdiğiniz siparişleri anlık takip edin.</p>
                </div>

                <form onSubmit={handleSearchOrder} className="order-search-box-card">
                  <div className="search-input-wrap">
                    <Search size={20} className="search-icon" />
                    <input 
                      type="text" 
                      required 
                      className="order-track-input"
                      placeholder="Sipariş Kodu (#12345) veya Telefon Numarası..."
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                    />
                    <button type="submit" className="btn-track-submit">
                      Siparişi Sorgula
                    </button>
                  </div>
                </form>

                {foundOrder && (
                  <div className="found-order-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-code-badge">Sipariş #{foundOrder.code || foundOrder.id.substring(0,6)}</span>
                        <h4>{foundOrder.customer_name}</h4>
                      </div>
                      <span className={`order-status-pill ${foundOrder.status}`}>
                        {foundOrder.status === 'pending' ? '⏳ Hazırlanıyor / Mağazada' : '✅ Tamamlandı'}
                      </span>
                    </div>

                    <div className="order-card-body">
                      <p><strong>📞 Telefon:</strong> {foundOrder.customer_phone}</p>
                      <p><strong>🚚 Teslimat Yöntemi:</strong> {foundOrder.delivery_method}</p>
                      <p><strong>💰 Toplam Tutar:</strong> {foundOrder.total_amount?.toLocaleString('tr-TR')} TL</p>
                      <p><strong>📅 Tarih:</strong> {new Date(foundOrder.created_at || Date.now()).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                )}

                {orderSearchAttempted && !foundOrder && (
                  <div className="no-order-found-alert">
                    <AlertCircle size={24} />
                    <div>
                      <strong>Sipariş Bulunamadı!</strong>
                      <p>Girdiğiniz koda veya telefon numarasına ait sipariş kaydı bulunamadı. Lütfen kontrol edip tekrar deneyin veya <strong>0850 644 1616</strong> hattımızdan bizi arayın.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 🔄 IADE VE DEGISIM TAB */}
            {activeTab === 'returns' && (
              <div className="tab-pane text-article">
                <h2>🔄 İade ve Değişim Şartları</h2>
                <p>Çeyza Alışveriş Merkezleri müşteri memnuniyetini en üst düzeyde tutmayı ilke edinmiştir. Almış olduğunuz ürünlerden herhangi bir sebeple memnun kalmamanız durumunda aşağıdaki koşullar çerçevesinde kolayca iade ve değişim yapabilirsiniz.</p>

                <h3>1. 14 Gün Koşulsuz Cayma Hakkı</h3>
                <p>6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca, teslim aldığınız tarihten itibaren <strong>14 gün içerisinde</strong> herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkınızı kullanabilirsiniz.</p>

                <h3>2. İade Şartları</h3>
                <ul>
                  <li>İade edilecek ürünün ambalajının, kutusunun ve varsa standart aksesuarlarının eksiksiz ve hasarsız olması gerekmektedir.</li>
                  <li>Kişisel bakım ürünleri, iç giyim, kulak içi kulaklıklar vb. hijyen hassasiyeti bulunan ürünlerde ambalaj açıldığı takdirde iade kabul edilmemektedir.</li>
                  <li>Kurulumu yetkili servis tarafından yapılması gereken Beyaz Eşya ve Televizyon gruplarında kutu yetkili servis dışında açılırsa garanti kapsamı dışına çıkar ve iade edilemez.</li>
                </ul>

                <h3>3. Ücretsiz İade Kargo Kodu</h3>
                <p>İade işlemlerinizi anlaşmalı kargo şirketlerimiz vasıtasıyla <strong>0850 644 1616</strong> hattımızdan alacağınız ücretsiz iade kodu ile yapabilirsiniz.</p>
              </div>
            )}

            {/* 🛠️ GARANTI VE SERVIS TAB */}
            {activeTab === 'warranty' && (
              <div className="tab-pane text-article">
                <h2>🛠️ Garanti ve Servis Prosedürü</h2>
                <p>Çeyza AVM bünyesinde satılan tüm elektronik, küçük ev aletleri ve beyaz eşya ürünleri <strong>%100 Orijinal, Türkiye Resmi Distribütör Garantilidir.</strong></p>

                <h3>1. Garanti Süresi ve Kapsamı</h3>
                <p>Satın aldığınız ürünler fatura tarihinden itibaren minimum <strong>2 Yıl boyunca</strong> üretici/ithalatçı firma garantisi altındadır. Garanti belgesi ve satış faturanız garanti süresince geçerlidir.</p>

                <h3>2. Arıza ve Yetkili Servis Yönlendirmesi</h3>
                <p>Ürününüzde herhangi bir arıza oluşması durumunda, markanın Türkiye genelindeki tüm <strong>Resmi Yetkili Servislerine</strong> doğrudan faturanız ile başvurabilir veya Çeyza AVM müşteri destek hattımız olan <strong>0850 644 1616</strong> numarasından servis kaydı oluşturabilirsiniz.</p>
              </div>
            )}

            {/* ❓ FAQ TAB */}
            {activeTab === 'faq' && (
              <div className="tab-pane">
                <div className="pane-title">
                  <h2>❓ Sıkça Sorulan Sorular (SSS)</h2>
                  <p>Çeyza AVM alışveriş süreçleri ile ilgili en sık sorulan soruların yanıtları aşağıdadır.</p>
                </div>

                <div className="faq-accordion-list">
                  <div className="faq-item">
                    <h4>💳 Kredi Kartı Olmadan Senetle veya Taksitle Alışveriş Yapabilir miyim?</h4>
                    <p>Evet! Çeyza AVM mağazalarımızda kredi kartsız, peşinatsız, kefilsiz senetli taksit seçeneklerimiz mevcuttur. Detaylı bilgi için <strong>0850 644 1616</strong> hattımız ile iletişime geçebilirsiniz.</p>
                  </div>

                  <div className="faq-item">
                    <h4>🚚 Kargo Ücreti Ne Kadar?</h4>
                    <p>Çeyza AVM üzerinde verilen 500 TL ve üzeri tüm alışverişlerde <strong>Kargo Ücretsizdir!</strong></p>
                  </div>

                  <div className="faq-item">
                    <h4>🏬 İnternetten Alıp Mağazadan Teslim Alabilir miyim?</h4>
                    <p>Evet! Sipariş aşamasında "Mağazadan Teslimat" seçeneğini işaretleyerek Bursa ve Kütahya şubelerimizden siparişinizi anında teslim alabilirsiniz.</p>
                  </div>

                  <div className="faq-item">
                    <h4>📄 Faturalarım Nasıl Ulaştırılıyor?</h4>
                    <p>Tüm siparişlerinize ait e-fatura veya e-arşiv faturalarınız kayıtlı e-posta adresinize ve ürün paketiniz içerisinde basılı olarak teslim edilir.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 🏢 ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="tab-pane text-article">
                <h2>🏢 Biz Kimiz? Çeyza AVM Hikayesi & Vizyonumuz</h2>
                <p><strong>Çeyza Alışveriş Merkezleri (Çeyza AVM)</strong>, 1998 yılından bu yana kaliteli perakende, ev yaşam ürünleri, dayanıklı tüketim malları ve çeyiz çözümlerinde Türkiye'nin öncü mağazacılık markalarından biridir.</p>

                <h3>🎯 Misyonumuz ve Değerlerimiz</h3>
                <p>Müşterilerimize en kaliteli Küçük Ev Aletleri, Beyaz Eşya, Mutfak Ürünleri, Elektronik Cihazlar, Ev Tekstili ve Halı gruplarını en uygun fiyatlar, esnek ödeme koşulları (kredi kartsız senetle taksit imkanı) ve %100 Orijinal Ürün garantisiyle sunmaktır.</p>

                <h3>🏬 Mağazalarımız ve Hizmet Ağımız</h3>
                <p>Bursa Osmangazi (Gazcılar Merkez), Yıldırım (Vişne Cad.), Nilüfer (İzmir Yolu), İnegöl, Mudanya ve Kütahya Merkez şubelerimiz başta olmak üzere fiziki perakende tecrübemizi web sitemiz ile Türkiye'nin 81 iline ulaştırıyoruz.</p>

                <div className="about-stats-grid mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: '#f8fafc', padding: '1.2rem', borderRadius: '12px', textAlign: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '1.4rem', color: '#d90429', display: 'block' }}>25+ Yıl</strong>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Perakende Deneyimi</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.4rem', color: '#d90429', display: 'block' }}>7+ Şube</strong>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Bursa & Kütahya</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '1.4rem', color: '#d90429', display: 'block' }}>%100</strong>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Müşteri Memnuniyeti</span>
                  </div>
                </div>
              </div>
            )}

            {/* 📜 TERMS TAB */}
            {activeTab === 'terms' && (
              <div className="tab-pane text-article">
                <h2>📜 Kullanım Koşulları</h2>
                <p>Bu internet sitesini ziyaret ederek ve kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.</p>
                <p>Çeyza Alışveriş Merkezleri sitemizde yer alan tüm ürün fiyatları, görseller ve promosyonlar üzerinde değişiklik yapma hakkını saklı tutar. Sitede olası dizgisel veya fiyatlandırma hatalarında Çeyza AVM güncel mağaza fiyatlarını esas alma hakkına sahiptir.</p>
              </div>
            )}

            {/* 🔒 PRIVACY TAB */}
            {activeTab === 'privacy' && (
              <div className="tab-pane text-article">
                <h2>🔒 Gizlilik ve Çerez Politikası</h2>
                <p>Çeyza AVM ziyaretçilerimizin ve müşterilerimizin mahremiyetine ve kişisel verilerinin güvenliğine en yüksek derecede önem vermektedir.</p>
                <p>Sitemizde gerçekleşen tüm alışveriş işlemleri 256-Bit SSL güvenlik sertifikası ile şifrelenmektedir. Kredi kartı ve ödeme bilgileriniz kesinlikle veritabanımızda saklanmaz.</p>
              </div>
            )}

            {/* ⚖️ KVKK TAB */}
            {activeTab === 'kvkk' && (
              <div className="tab-pane text-article">
                <h2>⚖️ KVKK Aydınlatma Metni</h2>
                <p>6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, Çeyza Alışveriş Merkezleri Veri Sorumlusu sıfatıyla kişisel verilerinizi hukuka uygun olarak işlemektedir.</p>
                <p>Toplanan ad, soyad, telefon ve adres gibi verileriniz yalnızca siparişinizin teslimi, faturanın düzenlenmesi ve müşteri hizmetleri süreçlerinin yürütülmesi amacıyla işlenmektedir.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
