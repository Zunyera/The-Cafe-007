const DELIVERY_FREE_THRESHOLD = 500;
const DELIVERY_FEE = 100;

function getDeliveryFee(totalAmount = 0, paymentMethod = 'Cash on Delivery') {
  const method = String(paymentMethod || '').toLowerCase();
  const isCod = method === 'cash on delivery' || method === 'cash';
  if (!isCod) return 0;
  return Number(totalAmount) < DELIVERY_FREE_THRESHOLD ? DELIVERY_FEE : 0;
}

module.exports = {
  DELIVERY_FREE_THRESHOLD,
  DELIVERY_FEE,
  getDeliveryFee,
};