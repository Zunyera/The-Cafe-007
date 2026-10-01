import { readLocal, writeLocal } from '../utils/format.js';
import { createRemoteOrder, fetchRemoteOrders, getToken } from '../services/api.js';

const USER_KEY = 'cafe007.session';

function getCurrentUserEmail() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return '';
    const user = JSON.parse(raw);
    return String(user?.email || '').toLowerCase();
  } catch {
    return '';
  }
}

/* Maps the API order shape to the shape the storefront pages render. */
export function fromApiOrder(order) {
  const user = order.user && typeof order.user === 'object' ? order.user : {};
  const branchSlug = order.branch && typeof order.branch === 'object' ? order.branch.slug : order.branch;

  const subtotal =
    typeof order.subtotal === 'number'
      ? order.subtotal
      : Math.max(0, Number(order.totalAmount || 0) - Number(order.deliveryFee || 0));

  const deliveryFee =
    typeof order.deliveryFee === 'number'
      ? order.deliveryFee
      : 0;

  const method = order.deliveryAddress ? 'delivery' : 'pickup';

  return {
    id: String(order._id || ''),
    code: String(order._id || '').slice(-8).toUpperCase(),
    createdAt: order.createdAt,
    ownerEmail: String(user.email || '').toLowerCase(),
    customer: {
      name: user.name || '',
      email: String(user.email || '').toLowerCase(),
      phone: order.phone || '',
      address: order.deliveryAddress || '',
      city: '',
      area: '',
    },
    items: (order.items || []).map(item => ({
      productId: item.food && typeof item.food === 'object' ? item.food.slug || '' : '',
      name: item.name,
      image: item.image || '',
      variant: item.selectedSize || '',
      flavour: item.flavour || '',
      quantity: item.quantity,
      unitPrice: item.price,
    })),
    subtotal,
    deliveryFee,
    method,
    branch: branchSlug || '',
    payment: order.paymentMethod || 'Cash on Delivery',
    notes: order.notes || '',
    status: order.status || 'Pending',
  };
}

function toApiOrder(order) {
  return {
    branch: order.branch,
    items: (order.items || []).map(item => ({
      name: item.name,
      quantity: item.quantity,
      selectedSize: item.variant || '',
      price: item.unitPrice,
      image: item.image || '',
      flavour: item.flavour || '',
    })),
    phone: order.customer?.phone || '',
    deliveryAddress:
      order.method === 'pickup'
        ? ''
        : [order.customer?.address, order.customer?.area, order.customer?.city].filter(Boolean).join(', '),
    paymentMethod: order.payment,
    notes: order.notes || '',
  };
}

export function getOrders() {
  const orders = readLocal('cafe007.orders', []);
  return Array.isArray(orders)
    ? orders.filter(order => order && (order.id || order.code) && Array.isArray(order.items) && order.customer)
    : [];
}

export async function saveOrder(order) {
  if (!getToken()) {
    const error = new Error('Please login before placing your order.');
    error.code = 'LOGIN_REQUIRED';
    throw error;
  }

  const data = await createRemoteOrder(toApiOrder(order));
  const apiOrder = data.order ? fromApiOrder(data.order) : null;
  const currentEmail = String(order.ownerEmail || order.customer?.email || getCurrentUserEmail() || '').toLowerCase();

  const saved = apiOrder
    ? {
        ...apiOrder,
        ownerEmail: currentEmail || apiOrder.ownerEmail || '',
        customer: {
          ...order.customer,
          ...apiOrder.customer,
          name: order.customer.name,
          email: currentEmail || order.customer.email || apiOrder.customer.email || '',
        },
      }
    : {
        ...order,
        ownerEmail: currentEmail,
        customer: {
          ...order.customer,
          email: currentEmail || order.customer?.email || '',
        },
      };

  const existing = getOrders().filter(entry => {
    const email = String(entry.ownerEmail || entry.customer?.email || '').toLowerCase();
    return email === currentEmail && entry.id !== saved.id && entry.id !== order.id;
  });

  writeLocal('cafe007.orders', [saved, ...existing]);
  return saved;
}

export async function refreshOrders() {
  if (!getToken()) return getOrders();

  try {
    const currentEmail = getCurrentUserEmail();
    const data = await fetchRemoteOrders();
    const remote = (data.orders || []).map(fromApiOrder).filter(order => order.id);

    const localRelevant = getOrders().filter(order => {
      const email = String(order.ownerEmail || order.customer?.email || '').toLowerCase();
      return !currentEmail || email === currentEmail;
    });

    const merged = new Map();
    [...remote, ...localRelevant].forEach(order => {
      const key = order.id || order.code;
      if (!key) return;

      const normalized = {
        ...order,
        ownerEmail: String(order.ownerEmail || order.customer?.email || currentEmail || '').toLowerCase(),
        customer: {
          ...order.customer,
          email: String(order.customer?.email || order.ownerEmail || currentEmail || '').toLowerCase(),
        },
      };

      if (!merged.has(key)) merged.set(key, normalized);
    });

    writeLocal(
      'cafe007.orders',
      [...merged.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );
  } catch {
    /* keep the local copy when the API is offline */
  }

  return getOrders();
}

export function orderItems(lines) {
  return lines.map(line => ({
    productId: line.productId,
    name: line.product.name,
    image: line.product.image,
    variant: line.variant,
    flavour: line.flavour,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
  }));
}