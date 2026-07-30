import { supabase, isSupabaseConfigured } from './supabaseClient';
import { mainCategories } from '../data/categories';

export async function fetchCategories() {
  if (!isSupabaseConfigured()) {
    return { data: mainCategories, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*, subcategories(*)');

    if (error) throw error;
    return { data: data || mainCategories, error: null };
  } catch (err) {
    console.warn('Category fetch fallback mock used:', err);
    return { data: mainCategories, error: null };
  }
}
