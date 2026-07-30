import { supabase, isSupabaseConfigured } from './supabaseClient';

export async function signUp({ email, password, fullName }) {
  if (!isSupabaseConfigured()) {
    return { data: { user: { email, fullName } }, error: null };
  }

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
}

export async function signIn({ email, password }) {
  if (!isSupabaseConfigured()) {
    return { data: { user: { email } }, error: null };
  }

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
