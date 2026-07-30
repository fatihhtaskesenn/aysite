-- ====================================================
-- ÇEYZA AVM SUPABASE SEED / MOCK DATA SCRIPT
-- ====================================================

-- 1. KATEGORİLER SEED DATA
INSERT INTO public.categories (id, name, slug, icon, sort_order) VALUES
('kucuk-ev-aletleri', 'Küçük Ev Aletleri', 'kucuk-ev-aletleri', 'Zap', 1),
('beyaz-esya', 'Beyaz Eşya', 'beyaz-esya', 'Tv', 2),
('mutfak-urunleri', 'Mutfak Ürünleri', 'mutfak-urunleri', 'Utensils', 3),
('elektronik-cihazlar', 'Elektronik Cihazlar', 'elektronik-cihazlar', 'Smartphone', 4),
('ev-tekstili', 'Ev Tekstili', 'ev-tekstili', 'Home', 5),
('kisisel-bakim', 'Kişisel Bakım', 'kisisel-bakim', 'Smile', 6),
('halilar', 'Halılar', 'halilar', 'Grid', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. FİZİKSEL MAĞAZALAR SEED DATA
INSERT INTO public.stores (id, name, city, address, phone, hours, map_url, pickup) VALUES
(1, 'Çeyza AVM Kanalboyu Şubesi', 'Bursa / Osmangazi', 'Kanalboyu Cad. No: 42, Osmangazi / Bursa', '0224 220 00 01', 'Haftanın her günü 09:00 - 21:00', 'https://maps.google.com/maps?q=Bursa+Kanalboyu&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(2, 'Çeyza AVM Emek Şubesi', 'Bursa / Osmangazi', 'Emek Adnan Menderes Mah. Turgut Özal Cad. No: 15, Osmangazi / Bursa', '0224 220 00 02', 'Haftanın her günü 09:00 - 21:00', 'https://maps.google.com/maps?q=Bursa+Emek&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(3, 'Çeyza AVM Yeşilyayla Şubesi', 'Bursa / Yıldırım', 'Yeşilyayla Cad. No: 78, Yıldırım / Bursa', '0224 220 00 03', 'Haftanın her günü 09:00 - 21:00', 'https://maps.google.com/maps?q=Bursa+Ye%C5%9Filyayla&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(4, 'Çeyza AVM Yavuzselim Şubesi', 'Bursa / Yıldırım', 'Yavuzselim Mah. Su Deposu Cad. No: 24, Yıldırım / Bursa', '0224 220 00 04', 'Haftanın her günü 09:00 - 21:00', 'https://maps.google.com/maps?q=Bursa+Yavuzselim&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(5, 'Çeyza AVM Orhangazi Şubesi', 'Bursa / Orhangazi', 'Yalova Cad. No: 88, Orhangazi / Bursa', '0224 573 00 05', 'Haftanın her günü 09:00 - 20:30', 'https://maps.google.com/maps?q=Orhangazi+Bursa&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(6, 'Çeyza AVM Kütahya Tavşanlı Şubesi', 'Kütahya / Tavşanlı', 'Cumhuriyet Cad. No: 34, Tavşanlı / Kütahya', '0274 614 00 06', 'Haftanın her günü 09:00 - 20:30', 'https://maps.google.com/maps?q=K%C3%BCtahya+Tav%C5%9Fanl%C4%B1&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(7, 'Çeyza AVM Kent Meydanı Şubesi', 'Bursa / Osmangazi', 'Santral Garaj Mah. Kıbrıs Şehitleri Cad. No: 12 (Kent Meydanı Yakını), Osmangazi / Bursa', '0224 220 00 07', 'Haftanın her günü 10:00 - 22:00', 'https://maps.google.com/maps?q=Bursa+Kent+Meydan%C4%B1&t=&z=15&ie=UTF8&iwloc=&output=embed', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address;

-- 3. ÖRNEK ÜRÜNLER SEED DATA
INSERT INTO public.products (id, title, category, subcategory, price, old_price, rating, reviews_count, image, in_stock, is_new, is_bestseller, discount_percent, badge, description, carpet_details) VALUES
('a1000000-0000-0000-0000-000000000001', 'Dyson V15 Detect Kablosuz Dik Süpürge', 'kucuk-ev-aletleri', 'Dikey Süpürge', 24999.00, 28999.00, 4.9, 328, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80', true, true, true, 14, 'Yılın Ürünü', 'Lazer aydınlatmalı ve piezo sensörlü en güçlü kablosuz şarjlı dik süpürge. 2 yıl Çeyza garantili.', NULL),

('a1000000-0000-0000-0000-000000000002', 'Philips XXL Smart Sensing Airfryer 1.4kg', 'kucuk-ev-aletleri', 'Airfryer & Fritöz', 6499.00, 8999.00, 4.8, 512, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80', true, false, true, 28, 'Çok Satan', 'Akıllı sensör teknolojisi ile az yağlı lezzetli pişirme sağlayan XXL hava fritözü.', NULL),

('a1000000-0000-0000-0000-000000000003', 'Karaca Hatır Hüp Türk Kahvesi Makinesi', 'kucuk-ev-aletleri', 'Elektrikli Çay & Kahve', 1299.00, 1699.00, 4.7, 184, 'https://images.unsplash.com/photo-1517668808822-9fea0282b941?w=800&auto=format&fit=crop&q=80', true, true, false, 23, 'Hızlı Kargo', 'Közde pişirme lezzeti ve bol köpüklü kahve deneyimi sunan 5 fincan kapasiteli kahve makinesi.', NULL),

('a1000000-0000-0000-0000-000000000004', 'Bosch NoFrost Kombi Tipi Buzdolabı 508Lt', 'beyaz-esya', 'Buzdolabı', 34999.00, 42999.00, 4.9, 94, 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80', true, true, true, 18, 'Derinlemesine Temizlik', 'VitaFresh tazelik sistemi, geniş iç hacim ve ultra sessiz Inverter kompresör.', NULL),

('a1000000-0000-0000-0000-000000000005', 'Karaca Bio Diamond 7 Parça Tencere Seti', 'mutfak-urunleri', 'Tencere & Tava Setleri', 4899.00, 6999.00, 4.8, 210, 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80', true, false, true, 30, 'Fırsat Ürünü', 'Gerçek elmas parçacıklı çizilmez dayanıklı 7 parça tencere ve kapak seti.', NULL),

('a1000000-0000-0000-0000-000000000006', 'Merinos 200x300 Modern İpek Dokuma Halı', 'halilar', 'Salon Halıları', 3499.00, 4999.00, 4.8, 142, 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=80', true, false, true, 30, 'Özel Dokuma', 'Leke tutmaz, antialerjik bambu ipek karışımlı lüks salon halısı.', '{"size": "200x300", "material": "Bambu İpek", "style": "Modern"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
