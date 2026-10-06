const API = window.API_URL || '/api';
const message = document.getElementById('authMessage');

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

const showMessage = (text, isError = false) => {
  message.textContent = text;
  message.style.color = isError ? '#c43e3e' : '#0f8b6f';
};

document.querySelectorAll('[data-auth-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-auth-tab]').forEach((tab) => tab.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.auth-form').forEach((form) => form.classList.add('hidden'));
    document.getElementById(`${button.dataset.authTab}Form`).classList.remove('hidden');
    showMessage('');
  });
});

const toObject = (form) => Object.fromEntries(new FormData(form).entries());

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('Signing in...');
  const formData = toObject(event.currentTarget);

  try {
    // If running with Supabase client (e.g. on GitHub Pages)
    if (window.USE_SUPABASE && typeof window.supabaseLogin === 'function') {
      const data = await window.supabaseLogin(formData.email, formData.password, formData.role);
      localStorage.setItem('ssms_token', data.token);
      localStorage.setItem('ssms_user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
      return;
    }

    // Otherwise use backend API
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    localStorage.setItem('ssms_token', data.token);
    localStorage.setItem('ssms_user', JSON.stringify(data.user));
    window.location.href = 'dashboard.html';
  } catch (error) {
    showMessage(error.message || 'Login failed.', true);
  }
});

document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('Creating account...');
  const formData = toObject(event.currentTarget);

  try {
    if (window.USE_SUPABASE && typeof window.supabaseRegister === 'function') {
      const data = await window.supabaseRegister(formData);
      showMessage('Account created. Opening dashboard...');
      localStorage.setItem('ssms_token', data.token);
      localStorage.setItem('ssms_user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
      return;
    }

    const response = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    showMessage('Account created. Opening dashboard...');
    localStorage.setItem('ssms_token', data.token);
    localStorage.setItem('ssms_user', JSON.stringify(data.user));
    window.location.href = 'dashboard.html';
  } catch (error) {
    showMessage(error.message || 'Registration failed.', true);
  }
});

document.getElementById('forgotForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('Password reset instructions have been recorded.');
});
