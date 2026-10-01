const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
const ADMIN_TOKEN_KEY = 'cafe007.adminToken';
const ADMIN_USER_KEY = 'cafe007.adminUser';

export function getToken() {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
    else localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    /* storage may be disabled */
  }
}

export function getAdminUser() {
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminUser(user) {
  try {
    if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(ADMIN_USER_KEY);
  } catch {
    /* storage may be disabled */
  }
}

export function clearAdminSession() {
  setToken('');
  setAdminUser(null);
}

export async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    const error = new Error('API server se connection nahi ho saka. Kya backend (npm run dev) chal raha hai?');
    error.network = true;
    throw error;
  }

  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && !path.startsWith('/auth')) clearAdminSession();
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed. Please try again.');
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  get: path => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: path => request(path, { method: 'DELETE' }),
};

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
export const RESERVATION_STATUSES = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];

export function pillClass(status) {
  return String(status || '').toLowerCase() === 'out for delivery' ? 'out' : String(status || '').toLowerCase();
}