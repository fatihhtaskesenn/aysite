-- ====================================================
-- ÇEYZA AVM TEK TIKLA VERİTABANI VE TABLO OLUŞTURMA SQL
-- Supabase Dashboard > SQL Editor içerisine yapıştırıp "Run" butonuna basın.
-- ====================================================

-- 1. UUID EKLENTİSİ
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. KATEGORİLER TABLOSU (categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT 'Grid',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ALT KATEGORİLER TABLOSU (subcategories)
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id VARCHAR(50) REFERENCES public.categories(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ÜRÜNLER TABLOSU (products)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  subcategory VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  image TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  discount_percent INT DEFAULT 0,
  badge VARCHAR(100),
  description TEXT,
  carpet_details JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FİZİKSEL MAĞAZALAR TABLOSU (stores)
CREATE TABLE IF NOT EXISTS public.stores (
  id INT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  hours VARCHAR(100) NOT NULL,
  map_url TEXT NOT NULL,
  pickup BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. KULLANICI PROFİLLERİ TABLOSU (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150),
  avatar_url TEXT,
  phone VARCHAR(50),
  address TEXT,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SİPARİŞLER TABLOSU (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email VARCHAR(150),
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  shipping_address TEXT NOT NULL,
  pickup_store_id INT REFERENCES public.stores(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'credit_card',
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SİPARİŞ DETAYLARI TABLOSU (order_items)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_title VARCHAR(255) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FAVORİLER TABLOSU (favorites)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 10. DEĞERLENDİRMELER TABLOSU (reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================
-- RLS (ROW LEVEL SECURITY) POLİTİKALARI (GÜVENLİK)
-- ====================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilsin (Public Read)
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (true);

-- Sipariş Oluşturma İzinleri
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Profiller ve Favoriler İzinleri
CREATE POLICY "Read Own Profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Manage Own Favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- ====================================================
-- SEED DATA (İLK YÜKLENECEK VERİLER)
-- ====================================================

-- 1. KATEGORİLER SEED
INSERT INTO public.categories (id, name, slug, icon, sort_order) VALUES
('kucuk-ev-aletleri', 'Küçük Ev Aletleri', 'kucuk-ev-aletleri', 'Zap', 1),
('beyaz-esya', 'Beyaz Eşya', 'beyaz-esya', 'Tv', 2),
('mutfak-urunleri', 'Mutfak Ürünleri', 'mutfak-urunleri', 'Utensils', 3),
('elektronik-cihazlar', 'Elektronik Cihazlar', 'elektronik-cihazlar', 'Smartphone', 4),
('ev-tekstili', 'Ev Tekstili', 'ev-tekstili', 'Home', 5),
('kisisel-bakim', 'Kişisel Bakım', 'kisisel-bakim', 'Smile', 6),
('halilar', 'Halılar', 'halilar', 'Grid', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. 7 RESMİ FİZİKSEL MAĞAZA SEED
INSERT INTO public.stores (id, name, city, address, phone, hours, map_url, pickup) VALUES
(1, 'Çeyza AVM Kanalboyu Şubesi', 'Bursa / Osmangazi', 'Kanalboyu Cad. No: 42, Osmangazi / Bursa', '0224 220 00 01', 'Haftanın her günü 09:00 - 21:00', 'https://maps.google.com/maps?q=Bursa+Kanalboyu&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(2, 'Çeyza AVM Emek Şubesi', 'Bursa / Osmangazi', 'Emek Adnan Menderes Mah. Turgut Özal Cad. No: 15, Osmangazi / Bursa', '0224 220 00 02', 'Haftanın her günü 09:00 - 21:00', 'https://maps.google.com/maps?q=Bursa+Emek&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(3, 'Çeyza AVM Yeşilyayla Şubesi', 'Bursa / Yıldırım', 'Yeşilyayla Cad. No: 78, Yıldırım / Bursa', '0224 220 00 03', 'Haftanın her günü 09:00 - 21:00', 'https://maps.google.com/maps?q=Bursa+Ye%C5%9Filyayla&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(4, 'Çeyza AVM Yavuzselim Şubesi', 'Bursa / Yıldırım', 'Yavuzselim Mah. Su Deposu Cad. No: 24, Yıldırım / Bursa', '0224 220 00 04', 'Haftanın her günü 09:00 - 21:00', 'https://maps.google.com/maps?q=Bursa+Yavuzselim&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(5, 'Çeyza AVM Orhangazi Şubesi', 'Bursa / Orhangazi', 'Yalova Cad. No: 88, Orhangazi / Bursa', '0224 573 00 05', 'Haftanın her günü 09:00 - 20:30', 'https://maps.google.com/maps?q=Orhangazi+Bursa&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(6, 'Çeyza AVM Kütahya Tavşanlı Şubesi', 'Kütahya / Tavşanlı', 'Cumhuriyet Cad. No: 34, Tavşanlı / Kütahya', '0274 614 00 06', 'Haftanın her günü 09:00 - 20:30', 'https://maps.google.com/maps?q=K%C3%BCtahya+Tav%C5%9Fanl%C4%B1&t=&z=15&ie=UTF8&iwloc=&output=embed', true),
(7, 'Çeyza AVM Kent Meydanı Şubesi', 'Bursa / Osmangazi', 'Santral Garaj Mah. Kıbrıs Şehitleri Cad. No: 12 (Kent Meydanı Yakını), Osmangazi / Bursa', '0224 220 00 07', 'Haftanın her günü 10:00 - 22:00', 'https://maps.google.com/maps?q=Bursa+Kent+Meydan%C4%B1&t=&z=15&ie=UTF8&iwloc=&output=embed', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. ÖRNEK ÜRÜNLER SEED
INSERT INTO public.products (id, title, category, subcategory, price, old_price, rating, reviews_count, image, in_stock, is_new, is_bestseller, discount_percent, badge, description, carpet_details) VALUES
('a1000000-0000-0000-0000-000000000001', 'Dyson V15 Detect Kablosuz Dik Süpürge', 'kucuk-ev-aletleri', 'Dikey Süpürge', 24999.00, 28999.00, 4.9, 328, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80', true, true, true, 14, 'Yılın Ürünü', 'Lazer aydınlatmalı ve piezo sensörlü en güçlü kablosuz şarjlı dik süpürge. 2 yıl Çeyza garantili.', NULL),

('a1000000-0000-0000-0000-000000000002', 'Philips XXL Smart Sensing Airfryer 1.4kg', 'kucuk-ev-aletleri', 'Airfryer & Fritöz', 6499.00, 8999.00, 4.8, 512, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80', true, false, true, 28, 'Çok Satan', 'Akıllı sensör teknolojisi ile az yağlı lezzetli pişirme sağlayan XXL hava fritözü.', NULL),

('a1000000-0000-0000-0000-000000000003', 'Karaca Hatır Hüp Türk Kahvesi Makinesi', 'kucuk-ev-aletleri', 'Elektrikli Çay & Kahve', 1299.00, 1699.00, 4.7, 184, 'https://images.unsplash.com/photo-1517668808822-9fea0282b941?w=800&auto=format&fit=crop&q=80', true, true, false, 23, 'Hızlı Kargo', 'Közde pişirme lezzeti ve bol köpüklü kahve deneyimi sunan 5 fincan kapasiteli kahve makinesi.', NULL),

('a1000000-0000-0000-0000-000000000004', 'Bosch NoFrost Kombi Tipi Buzdolabı 508Lt', 'beyaz-esya', 'Buzdolabı', 34999.00, 42999.00, 4.9, 94, 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80', true, true, true, 18, 'Derinlemesine Temizlik', 'VitaFresh tazelik sistemi, geniş iç hacim ve ultra sessiz Inverter kompresör.', NULL),

('a1000000-0000-0000-0000-000000000005', 'Karaca Bio Diamond 7 Parça Tencere Seti', 'mutfak-urunleri', 'Tencere & Tava Setleri', 4899.00, 6999.00, 4.8, 210, 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80', true, false, true, 30, 'Fırsat Ürünü', 'Gerçek elmas parçacıklı çizilmez dayanıklı 7 parça tencere ve kapak seti.', NULL),

('a1000000-0000-0000-0000-000000000006', 'Merinos 200x300 Modern İpek Dokuma Halı', 'halilar', 'Salon Halıları', 3499.00, 4999.00, 4.8, 142, 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=80', true, false, true, 30, 'Özel Dokuma', 'Leke tutmaz, antialerjik bambu ipek karışımlı lüks salon halısı.', '{"size": "200x300", "material": "Bambu İpek", "style": "Modern"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
