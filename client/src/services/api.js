import { featuredDeals, popularProducts, productById, products } from '../data/menu.js';
import { branches } from '../data/restaurant.js';

const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
const TOKEN_KEY = 'cafe007.token';

function readStorage(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeStorage(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    /* storage may be disabled */
  }
}

export const getToken = () => readStorage(TOKEN_KEY);
export const setToken = token => writeStorage(TOKEN_KEY, token);

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    const error = new Error('Server se connection nahi ho saka.');
    error.network = true;
    throw error;
  }

  const data = await response.json().catch(() => ({}));
  if (response.status === 401) setToken('');
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed. Please try again.');
    error.status = response.status;
    throw error;
  }
  return data;
}

/* ---------------- Auth routes: /api/auth ---------------- */
export const registerRemote = user => request('/auth/register', { method: 'POST', body: user, auth: false });
export const loginRemote = (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false });
export const fetchProfile = () => request('/auth/me');
export const updateRemoteProfile = user => request('/auth/profile', { method: 'PUT', body: user });

/* ---------------- Order + reservation routes ---------------- */
export const createRemoteOrder = order => request('/orders', { method: 'POST', body: order });
export const fetchRemoteOrders = () => request('/orders/my-orders');
export const createRemoteReservation = data => request('/reservations', {
  method: 'POST',
  body: {
    name: data.name,
    phone: data.phone,
    branch: data.branch,
    date: data.date,
    time: data.time,
    guests: data.guests,
    specialRequest: data.specialRequest || '',
  },
});
export const submitReservation = data => createRemoteReservation(data);
export const fetchMyReservations = () => request('/reservations/my-reservations');
export const cancelMyReservation = id => request(`/reservations/${id}/cancel`, { method: 'PUT' });

/* ---------------- Catalog: /api/foods, /api/deals, /api/branches ---------------- */
function sizeList(sizes) {
  const map = {};
  (Array.isArray(sizes) ? sizes : []).forEach(size => {
    if (size && size.name) map[size.name] = Number(size.price) || 0;
  });
  return Number.isFinite(map.Small) ? map : null;
}

function foodToProduct(food) {
  const name = String(food?.name || '').trim();
  const id = String(food?.slug || '').trim();
  if (!id || !name) return null;
  const sizes = sizeList(food.sizes);
  const product = {
    id,
    name,
    category: String(food.category?.name || food.subCategory || 'Snacks'),
    price: sizes ? sizes.Small : Number(food.basePrice) || 0,
    image: String(food.image || '/images/deal.jpg'),
    description: String(food.description || ''),
  };
  if (sizes) product.sizes = sizes;
  if (Array.isArray(food.flavours) && food.flavours.length) product.flavours = food.flavours.map(String);
  if (Array.isArray(food.contents) && food.contents.length) product.contents = food.contents.map(String);
  return product;
}

function dealToProduct(deal) {
  const name = String(deal?.name || '').trim();
  const id = String(deal?.slug || '').trim();
  if (!id || !name) return null;
  const items = Array.isArray(deal.items) ? deal.items.map(String) : [];
  const match = id.match(/(\d+)$/);
  const big = id.startsWith('big-deal');
  return {
    id,
    name,
    category: big ? 'Pizza Deals' : 'Deals',
    price: Number(deal.price) || 0,
    image: String(deal.image || '/images/deal.jpg'),
    description: items.join(' + '),
    contents: items,
    dealNumber: match ? Number(match[1]) : undefined,
    tags: big ? ['pizza', 'combo', 'regular pizza'] : ['combo', 'special deal'],
  };
}

function replaceList(target, next) {
  target.length = 0;
  target.push(...next);
}

export function applyCatalog(foods = [], deals = []) {
  const safe = [...foods.map(foodToProduct), ...deals.map(dealToProduct)].filter(Boolean);
  if (!safe.length) return false;

  replaceList(products, safe);
  productById.clear();
  safe.forEach(product => productById.set(product.id, product));

  const keep = (list, ids) => replaceList(list, ids.map(id => productById.get(id)).filter(Boolean));
  keep(popularProducts, ['zinger', 'chicken-fajita', 'cheese-shawarma', 'loaded-fries-pizza-fries']);
  keep(featuredDeals, ['deal-3', 'big-deal-2', 'deal-12']);
  return true;
}

export function applyBranches(items) {
  const safe = (Array.isArray(items) ? items : [])
    .map(item => {
      const name = String(item?.name || '').trim();
      const id = String(item?.slug || name).trim();
      if (!id || !name) return null;
      return {
        id,
        name,
        menuLabel: item.openingHours && item.openingHours.length < 40 ? item.openingHours : name,
        address: item.address ? String(item.address) : null,
        phones: String(item.phone || '').split(',').map(value => value.trim()).filter(Boolean),
        hours: item.openingHours ? String(item.openingHours) : null,
        isMain: id === 'burewala',
        delivery: typeof item.deliveryAvailable === 'boolean' ? item.deliveryAvailable : null,
      };
    })
    .filter(Boolean);
  if (!safe.length) return false;
  replaceList(branches, safe);
  return true;
}

export async function syncCatalog() {
  try {
    const [foods, deals, places] = await Promise.all([
      request('/foods', { auth: false }),
      request('/deals', { auth: false }),
      request('/branches', { auth: false }),
    ]);
    applyCatalog(foods.foods || [], deals.deals || []);
    applyBranches(places.branches || []);
    return true;
  } catch {
    // API offline: the bundled official menu keeps the storefront fully usable.
    return false;
  }
}

/* The spec has no public contact endpoint, so this stays a local-only form action. */
export async function submitContact() {
  return { ok: true, local: true };
}