// Optional Supabase Client for Frontend
// Configure your Supabase credentials here or by setting window.SUPABASE_URL and window.SUPABASE_ANON_KEY before this file loads.
window.SUPABASE_URL = window.SUPABASE_URL || '';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

let supabaseClient = null;

function initSupabase() {
  if (window.supabase && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    if (!supabaseClient) {
      supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }
    return supabaseClient;
  }
  return null;
}

window.getSupabaseClient = initSupabase;
