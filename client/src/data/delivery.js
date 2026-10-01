export const DELIVERY_FREE_THRESHOLD = 500;
export const DELIVERY_FEE = 100;

export function getDeliveryFee(subtotal = 0, method = 'delivery') {
  if (method !== 'delivery') return 0;
  return Number(subtotal) < DELIVERY_FREE_THRESHOLD ? DELIVERY_FEE : 0;
}