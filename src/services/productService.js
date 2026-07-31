import { supabase } from './supabaseClient';

// In-Memory Cache for Instant Zero-Delay Load
let inMemoryProductCache = null;

/**
 * Normalizes any category string (slug, Turkish name, alternate spellings)
 * to standard category slugs ('elektronik', 'kucuk-ev-aletleri', 'beyaz-esya', etc.)
 */
export function normalizeCategory(cat) {
  if (!cat || cat === 'all') return 'all';
  const str = String(cat).toLowerCase().trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');

  if (str.includes('elektronik')) return 'elektronik';
  if (str.includes('kucuk') || str.includes('alet')) return 'kucuk-ev-aletleri';
  if (str.includes('beyaz') || str.includes('esya')) return 'beyaz-esya';
  if (str.includes('mutfak')) return 'mutfak-urunleri';
  if (str.includes('tekstil') || str.includes('evtekstil')) return 'ev-tekstili';
  if (str.includes('bakim') || str.includes('kisisel')) return 'kisisel-bakim';
  if (str.includes('hali')) return 'halilar';

  return cat;
}

// Custom Local Storage Backup Helpers
function getCustomLocalProducts() {
  try {
    const stored = localStorage.getItem('ceyza_custom_added_products');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomLocalProducts(customList) {
  try {
    localStorage.setItem('ceyza_custom_added_products', JSON.stringify(customList));
  } catch (e) {
    console.warn('Custom products save error:', e);
  }
}

// Helper to get cached products from localStorage or Memory
function getLocalProductCache() {
  if (inMemoryProductCache && inMemoryProductCache.length > 0) {
    return inMemoryProductCache;
  }
  try {
    const stored = localStorage.getItem('ceyza_products_cache');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryProductCache = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Cache parse error:', e);
  }
  return null;
}

// Helper to save cache
function saveLocalProductCache(products) {
  inMemoryProductCache = products;
  try {
    localStorage.setItem('ceyza_products_cache', JSON.stringify(products));
  } catch (e) {
    console.warn('Cache save error:', e);
  }
}

/**
 * Canlı Supabase Veritabanından Ürünleri Çeker (Anında Hızlı Önbellek + Kategori Normalizasyonu + Yerel Yedekleme)
 */
export async function fetchProducts(filters = {}) {
  const { category, subcategory, searchQuery, priceRange, carpetSize, carpetMaterial } = filters;
  let allProducts = [];

  try {
    // Supabase'den tüm ürünleri çek
    const { data, error } = await supabase.from('products').select('*');

    if (!error && data && Array.isArray(data)) {
      allProducts = data.map(item => ({
        id: item.id,
        name: item.title || item.name,
        title: item.title || item.name,
        category: normalizeCategory(item.category),
        rawCategory: item.category,
        subcategory: item.subcategory || 'Genel',
        brand: item.brand || 'Çeyza AVM',
        price: Number(item.price),
        originalPrice: item.old_price ? Number(item.old_price) : null,
        rating: item.rating ? Number(item.rating) : 5.0,
        reviewCount: item.reviews_count ? Number(item.reviews_count) : 0,
        image: item.image,
        inStock: item.in_stock !== false,
        isNew: Boolean(item.is_new),
        isBestseller: Boolean(item.is_bestseller),
        isDeal: Boolean(item.is_deal || (item.badge && item.badge.includes('Fırsat'))),
        badge: item.badge || (item.discount_percent ? `%${item.discount_percent} İNDİRİM` : null),
        description: item.description || '',
        size: item.carpet_details?.size || item.size || '',
        material: item.carpet_details?.material || item.material || ''
      }));
    }
  } catch (err) {
    console.warn('Supabase fetch exception:', err);
  }

  // Yerel eklenen özel ürünleri birleştir (Supabase hatası veya RLS durumunda kaybolmasın)
  const customLocal = getCustomLocalProducts();
  if (customLocal.length > 0) {
    customLocal.forEach(cp => {
      const normCat = normalizeCategory(cp.category);
      const existsIndex = allProducts.findIndex(p => p.id === cp.id);
      const formattedCp = {
        ...cp,
        category: normCat,
        inStock: cp.inStock !== false,
        isDeal: Boolean(cp.isDeal || cp.is_deal || (cp.badge && cp.badge.includes('Fırsat')))
      };
      if (existsIndex >= 0) {
        allProducts[existsIndex] = { ...allProducts[existsIndex], ...formattedCp };
      } else {
        allProducts.unshift(formattedCp);
      }
    });
  }

  // Filtreleme mantığı
  let filtered = [...allProducts];

  if (category && category !== 'all') {
    const targetCat = normalizeCategory(category);
    filtered = filtered.filter(p => normalizeCategory(p.category) === targetCat);
  }

  if (subcategory && subcategory !== 'all') {
    filtered = filtered.filter(p => (p.subcategory || '').toLowerCase().includes(subcategory.toLowerCase()));
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      (p.title || '').toLowerCase().includes(q) || 
      (p.subcategory || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q)
    );
  }

  if (priceRange) {
    filtered = filtered.filter(p => p.price <= priceRange);
  }
  if (carpetSize && carpetSize !== 'all') {
    filtered = filtered.filter(p => p.size === carpetSize);
  }
  if (carpetMaterial && carpetMaterial !== 'all') {
    filtered = filtered.filter(p => p.material === carpetMaterial);
  }

  saveLocalProductCache(allProducts);
  return { data: filtered, error: null };
}

/**
 * Görsel Dosyasını Supabase Storage veya DataURL Yükle
 */
export async function uploadProductImage(file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ url: reader.result, error: null });
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ url: reader.result, error: null });
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Yeni Ürün Ekle (ADMIN) - Kesintisiz Çift Kayıt (Supabase + Local Backup)
 */
export async function createProduct(productData) {
  const normCat = normalizeCategory(productData.category);
  const newProductObj = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: productData.title || productData.name,
    name: productData.title || productData.name,
    category: normCat,
    subcategory: productData.subcategory || 'Genel',
    price: Number(productData.price),
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
    image: productData.image,
    badge: productData.badge || null,
    isDeal: Boolean(productData.isDeal),
    description: productData.description || '',
    inStock: productData.inStock !== false,
    brand: productData.brand || 'Çeyza AVM',
    created_at: new Date().toISOString()
  };

  // Yerel veritabanına hemen ekle
  const customLocal = getCustomLocalProducts();
  saveCustomLocalProducts([newProductObj, ...customLocal]);

  try {
    const payload = {
      title: newProductObj.title,
      category: newProductObj.category,
      subcategory: newProductObj.subcategory,
      price: newProductObj.price,
      old_price: newProductObj.originalPrice,
      image: newProductObj.image,
      badge: newProductObj.badge,
      is_deal: newProductObj.isDeal,
      description: newProductObj.description,
      in_stock: newProductObj.inStock
    };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (data && data.id) {
      newProductObj.id = data.id;
    }
  } catch (err) {
    console.warn('Supabase insert error (local backup saved):', err);
  }

  // Cache temizle
  inMemoryProductCache = null;
  localStorage.removeItem('ceyza_products_cache');

  return { data: newProductObj, error: null };
}

/**
 * Ürün Düzenle (ADMIN)
 */
export async function updateProduct(id, productData) {
  const normCat = normalizeCategory(productData.category);

  // Yerel listeyi güncelle
  const customLocal = getCustomLocalProducts();
  const updatedCustom = customLocal.map(p => p.id === id ? { ...p, ...productData, category: normCat } : p);
  saveCustomLocalProducts(updatedCustom);

  try {
    const payload = {
      title: productData.title || productData.name,
      category: normCat,
      subcategory: productData.subcategory || 'Genel',
      price: Number(productData.price),
      old_price: productData.originalPrice ? Number(productData.originalPrice) : null,
      image: productData.image,
      badge: productData.badge || null,
      is_deal: productData.isDeal,
      description: productData.description || '',
      in_stock: productData.inStock !== false
    };

    await supabase.from('products').update(payload).eq('id', id);
  } catch (err) {
    console.warn('Supabase update error:', err);
  }

  inMemoryProductCache = null;
  localStorage.removeItem('ceyza_products_cache');

  return { error: null };
}

/**
 * Ürün Sil (ADMIN)
 */
export async function deleteProduct(id) {
  // Yerel listeden sil
  const customLocal = getCustomLocalProducts();
  saveCustomLocalProducts(customLocal.filter(p => p.id !== id));

  try {
    await supabase.from('products').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase delete error:', err);
  }

  inMemoryProductCache = null;
  localStorage.removeItem('ceyza_products_cache');

  return { error: null };
}
