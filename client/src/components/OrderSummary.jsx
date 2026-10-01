import { Check, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../utils/format.js';
import { DELIVERY_FREE_THRESHOLD, getDeliveryFee } from '../data/delivery.js';

export default function OrderSummary({ children, method = 'delivery', showItems = false }) {
  const { lines, subtotal, count } = useCart();
  const deliveryFee = getDeliveryFee(subtotal, method);
  const free = deliveryFee === 0;
  const total = subtotal + deliveryFee;

  return (
    <aside className="order-summary">
      <p className="eyebrow">The delicious details</p>
      <h2>Order summary</h2>

      {showItems && (
        <div className="summary-items">
          {lines.map(line => (
            <div key={line.key}>
              <div>
                <strong>{line.quantity} &times; {line.product.name}</strong>
                {(line.variant || line.flavour) && (
                  <small>{[line.variant, line.flavour].filter(Boolean).join(' / ')}</small>
                )}
              </div>
              <span>{money(line.subtotal)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="summary-row">
        <span>Subtotal ({count} {count === 1 ? 'item' : 'items'})</span>
        <strong>{money(subtotal)}</strong>
      </div>

      <div className="summary-row">
        <span>{method === 'pickup' ? 'Collection' : 'Delivery'}</span>
        <span className={free ? 'free-label' : 'muted'}>
          {free ? (method === 'pickup' ? 'No fee' : 'FREE') : money(deliveryFee)}
        </span>
      </div>

      <div className="summary-total">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>

      {!free && (
        <p className="summary-note">
          A delivery fee of {money(deliveryFee)} applies to cash on delivery orders below Rs. {DELIVERY_FREE_THRESHOLD}.
        </p>
      )}

      <div className="summary-delivery">
        {subtotal >= DELIVERY_FREE_THRESHOLD ? <Check size={19} /> : <Truck size={20} />}
        <p>
          {subtotal >= DELIVERY_FREE_THRESHOLD
            ? 'Your order qualifies for free delivery.'
            : `Cash on delivery orders below Rs. ${DELIVERY_FREE_THRESHOLD} include ${money(deliveryFee)} delivery.`}
        </p>
      </div>

      {children}
    </aside>
  );
}