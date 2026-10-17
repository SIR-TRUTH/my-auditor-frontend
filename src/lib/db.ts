import { supabase } from './supabaseClient';

export interface UserRecord {
  id: string;
  legal_name: string;
  email: string;
  phone: string;
  created_at?: string;
}

export async function saveUserToCloud(user: UserRecord) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
    const { data, error } = await supabase
      .from('users')
      .upsert([user], { onConflict: 'email' });
    if (error) console.error('Supabase User Save Error:', error);
    return data;
  } catch (err) {
    console.error('Database error:', err);
    return null;
  }
}

export async function fetchUsersFromCloud() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Supabase Fetch Users Error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Database fetch error:', err);
    return [];
  }
}