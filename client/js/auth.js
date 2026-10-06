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
  try {
    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toObject(event.currentTarget))
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
  try {
    const response = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toObject(event.currentTarget))
    });
    const data = await parseResponse(response);
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    showMessage('Account created. You can open the dashboard now.');
    localStorage.setItem('ssms_token', data.token);
    localStorage.setItem('ssms_user', JSON.stringify(data.user));
    window.location.href = 'dashboard.html';
  } catch (error) {
    showMessage(error.message || 'Registration failed.', true);
  }
});

document.getElementById('forgotForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const response = await fetch(`${API}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toObject(event.currentTarget))
  });
  const data = await parseResponse(response);
  showMessage(data.message || 'Request completed.');
});
