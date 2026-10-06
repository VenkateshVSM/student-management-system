require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error.message);
  }
}

function getSupabase() {
  if (!supabase) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase client not initialized: Missing SUPABASE_URL or SUPABASE_KEY in environment variables.'
      );
    }
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}

module.exports = {
  supabase,
  getSupabase,
  createClient,
  isConfigured: Boolean(supabaseUrl && supabaseKey)
};
