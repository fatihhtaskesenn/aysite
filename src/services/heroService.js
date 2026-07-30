import { supabase } from './supabaseClient';

// In-Memory & LocalStorage Cache for 0ms Instant Load
let inMemoryHeroCache = null;

export const DEFAULT_HERO_BANNERS = [
  {
    id: 'hero-1',
    title: 'Çeyza Büyük Çekiliş Fırsatları',
    image: '/resimler/insta_cekilis.png',
    order_index: 1,
    is_active: true
  },
  {
    id: 'hero-2',
    title: '100 TL Taksitle Fırsat Ürünleri',
    image: '/resimler/insta_taksit.png',
    order_index: 2,
    is_active: true
  },
  {
    id: 'hero-3',
    title: 'Temmuz Fırsatlarında Son Günler!',
    image: '/resimler/insta_temmuz.png',
    order_index: 3,
    is_active: true
  },
  {
    id: 'hero-4',
    title: 'Philips Ev Aletlerinde Efsane İndirim',
    image: '/resimler/insta_philips.png',
    order_index: 4,
    is_active: true
  }
];

export function getLocalHeroCache() {
  if (inMemoryHeroCache && inMemoryHeroCache.length > 0) {
    return inMemoryHeroCache;
  }
  try {
    const stored = localStorage.getItem('ceyza_hero_banners_cache');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryHeroCache = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Hero Cache parse error:', e);
  }
  return null;
}

function saveLocalHeroCache(banners) {
  inMemoryHeroCache = banners;
  try {
    localStorage.setItem('ceyza_hero_banners_cache', JSON.stringify(banners));
  } catch (e) {
    console.warn('Hero Cache save error:', e);
  }
}

/**
 * Fetch Hero Banners (Instant Cache + Background Supabase Sync)
 */
export async function fetchHeroBanners() {
  const cached = getLocalHeroCache();

  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      saveLocalHeroCache(data);
      return { data, error: null };
    }
  } catch (e) {
    console.warn('Supabase hero_banners fetch error:', e);
  }

  // Return cached data or fallback defaults
  const resultData = cached || DEFAULT_HERO_BANNERS;
  saveLocalHeroCache(resultData);
  return { data: resultData, error: null };
}

/**
 * Create New Hero Banner
 */
export async function createHeroBanner(bannerData) {
  const current = getLocalHeroCache() || DEFAULT_HERO_BANNERS;
  const tempId = `temp-hero-${Date.now()}`;
  const newBanner = {
    id: tempId,
    title: bannerData.title || 'Kampanya Görseli',
    image: bannerData.image,
    order_index: current.length + 1,
    is_active: true,
    created_at: new Date().toISOString()
  };

  const updated = [...current, newBanner];
  saveLocalHeroCache(updated);

  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .insert([{
        title: bannerData.title || 'Kampanya Görseli',
        image: bannerData.image,
        order_index: current.length + 1,
        is_active: true
      }])
      .select();

    if (!error && data && data[0]) {
      const synced = updated.map(b => b.id === tempId ? data[0] : b);
      saveLocalHeroCache(synced);
      return { data: data[0], error: null };
    }
    return { data: newBanner, error: error?.message || null };
  } catch (e) {
    return { data: newBanner, error: e.message };
  }
}

/**
 * Update Hero Banner
 */
export async function updateHeroBanner(id, updates) {
  const current = getLocalHeroCache() || DEFAULT_HERO_BANNERS;
  const updated = current.map(b => b.id === id ? { ...b, ...updates } : b);
  saveLocalHeroCache(updated);

  try {
    const { data, error } = await supabase
      .from('hero_banners')
      .update(updates)
      .eq('id', id)
      .select();

    return { data: data?.[0] || null, error: error?.message || null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

/**
 * Delete Hero Banner
 */
export async function deleteHeroBanner(id) {
  const current = getLocalHeroCache() || DEFAULT_HERO_BANNERS;
  const updated = current.filter(b => b.id !== id);
  saveLocalHeroCache(updated);

  try {
    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id);

    return { error: error?.message || null };
  } catch (e) {
    return { error: e.message };
  }
}
