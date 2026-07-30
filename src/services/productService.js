import { supabase } from './supabaseClient';

// In-Memory Cache for Instant Zero-Delay Load
let inMemoryProductCache = null;

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
 * Canlı Supabase Veritabanından Ürünleri Çeker (Anında Hızlı Önbellek + Arka Planda Güncelleme)
 */
export async function fetchProducts(filters = {}) {
  const { category, subcategory, searchQuery, priceRange, carpetSize, carpetMaterial } = filters;

  // 1. Önce Hızlı Önbelekten Veri Al (0 milisaniye Gecikme!)
  const cachedData = getLocalProductCache();

  // Arka Planda Supabase'den Canlı Çekim İşlemi
  try {
    let query = supabase.from('products').select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (subcategory && subcategory !== 'all') {
      query = query.eq('subcategory', subcategory);
    }
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,subcategory.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetch error, fallback cache used:', error);
      if (cachedData) {
        return { data: applyClientFilters(cachedData, filters), error: null };
      }
      return { data: [], error };
    }

    const normalizedData = (data || []).map(item => ({
      id: item.id,
      name: item.title || item.name,
      title: item.title || item.name,
      category: item.category,
      subcategory: item.subcategory,
      brand: item.brand || 'Çeyza AVM',
      price: Number(item.price),
      originalPrice: item.old_price ? Number(item.old_price) : null,
      rating: item.rating ? Number(item.rating) : 5.0,
      reviewCount: item.reviews_count ? Number(item.reviews_count) : 0,
      image: item.image,
      inStock: item.in_stock !== false,
      isNew: Boolean(item.is_new),
      isBestseller: Boolean(item.is_bestseller),
      badge: item.badge || (item.discount_percent ? `%${item.discount_percent} İNDİRİM` : null),
      description: item.description,
      size: item.carpet_details?.size || item.size,
      material: item.carpet_details?.material || item.material
    }));

    // Cache'i Yenile (Filtresiz ham veri ise)
    if ((!category || category === 'all') && !searchQuery) {
      saveLocalProductCache(normalizedData);
    }

    const finalResult = applyClientFilters(normalizedData, filters);
    return { data: finalResult, error: null };
  } catch (err) {
    console.error('Supabase Bağlantı Hatası:', err);
    if (cachedData) {
      return { data: applyClientFilters(cachedData, filters), error: null };
    }
    return { data: [], error: err };
  }
}

// Client Side Filter Helper
function applyClientFilters(productsList, filters) {
  const { priceRange, carpetSize, carpetMaterial } = filters;
  let result = [...productsList];

  if (priceRange) {
    result = result.filter(p => p.price <= priceRange);
  }
  if (carpetSize && carpetSize !== 'all') {
    result = result.filter(p => p.size === carpetSize);
  }
  if (carpetMaterial && carpetMaterial !== 'all') {
    result = result.filter(p => p.material === carpetMaterial);
  }

  return result;
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
 * Yeni Ürün Ekle (ADMIN)
 */
export async function createProduct(productData) {
  try {
    const payload = {
      title: productData.title || productData.name,
      category: productData.category,
      subcategory: productData.subcategory || 'Genel',
      price: Number(productData.price),
      old_price: productData.originalPrice ? Number(productData.originalPrice) : null,
      image: productData.image,
      badge: productData.badge || null,
      description: productData.description || '',
      in_stock: productData.inStock !== false,
      carpet_details: productData.size || productData.material ? { size: productData.size, material: productData.material } : null
    };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    
    // Clear Cache
    inMemoryProductCache = null;
    localStorage.removeItem('ceyza_products_cache');

    return { data, error: null };
  } catch (err) {
    console.error('Ürün ekleme hatası:', err);
    return { data: null, error: err };
  }
}

/**
 * Ürün Düzenle (ADMIN)
 */
export async function updateProduct(id, productData) {
  try {
    const payload = {
      title: productData.title || productData.name,
      category: productData.category,
      subcategory: productData.subcategory || 'Genel',
      price: Number(productData.price),
      old_price: productData.originalPrice ? Number(productData.originalPrice) : null,
      image: productData.image,
      badge: productData.badge || null,
      description: productData.description || '',
      in_stock: productData.inStock !== false,
      carpet_details: productData.size || productData.material ? { size: productData.size, material: productData.material } : null
    };

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Clear Cache
    inMemoryProductCache = null;
    localStorage.removeItem('ceyza_products_cache');

    return { data, error: null };
  } catch (err) {
    console.error('Ürün güncelleme hatası:', err);
    return { data: null, error: err };
  }
}

/**
 * Ürün Sil (ADMIN)
 */
export async function deleteProduct(id) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Clear Cache
    inMemoryProductCache = null;
    localStorage.removeItem('ceyza_products_cache');

    return { error: null };
  } catch (err) {
    console.error('Ürün silme hatası:', err);
    return { error: err };
  }
}
