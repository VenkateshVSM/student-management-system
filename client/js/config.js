// ==============================================================================
// Application Configuration & Host Detection
// ==============================================================================

// Supabase Cloud Project Configuration
window.SUPABASE_URL = window.SUPABASE_URL || 'https://tmbkftjjghhvbeeiailw.supabase.co';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'sb_publishable_7ZuS9oy7WU7gZCus7JU1tQ_1V9gXwU7';

// Detect if running on static hosting (e.g. GitHub Pages) where /api server is not hosted
const isGitHubPages = window.location.hostname.includes('github.io');
const isStaticHost = isGitHubPages || window.location.protocol === 'file:';

// When running on GitHub Pages or static host, direct Supabase mode is automatically enabled!
window.USE_SUPABASE = isStaticHost || Boolean(!window.API_URL && window.SUPABASE_URL);

// Base URL for Express REST API when running with local/custom backend
window.API_URL = window.API_URL || (isStaticHost ? '' : '/api');
