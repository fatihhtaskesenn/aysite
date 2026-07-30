import { supabase, isSupabaseConfigured } from './supabaseClient';
import { officialStores } from '../components/StoreLocatorModal';

export async function fetchStores() {
  if (!isSupabaseConfigured()) {
    return { data: officialStores, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return { data: data || officialStores, error: null };
  } catch (err) {
    return { data: officialStores, error: null };
  }
}
