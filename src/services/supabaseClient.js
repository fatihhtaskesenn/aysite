import { createClient } from '@supabase/supabase-js';

// Sanitize URL: strip trailing /rest/v1/ or trailing slashes if present
let rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://njwnssidbmgxnchilyyr.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if valid credentials are available
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl && 
    !supabaseUrl.includes('your-supabase-project') &&
    supabaseAnonKey && 
    !supabaseAnonKey.includes('placeholder')
  );
};
