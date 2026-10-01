import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Banknote, Info, MapPin, Phone, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { branches, restaurant } from '../data/restaurant.js';
import { orderItems, saveOrder } from '../data/orders.js';
import { telephone, validPhone } from '../utils/format.js';
import { Field, PageHeading, SuccessState } from '../components/ui.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import { getDeliveryFee } from '../data/delivery.js';

export default function Checkout() {
  const { lines, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState('delivery');
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key) => String(data.get(key) || '').trim();
    if (!validPhone(value('phone'))) { setError('Please enter a valid contact number.'); return; }
    if (!value('name') || !value('email') || (method === 'delivery' && (!value('address') || !value('city')))) { setError('Please complete all required details.'); return; }
    if (!lines.length) return;
    if (!user) { navigate('/login', { state: { from: '/checkout', message: 'Please login to place your order.' } }); return; }

    const orderId = `C007-${Date.now().toString(36).toUpperCase()}`;
    const deliveryFee = getDeliveryFee(subtotal, method);
    const next = {
      code: orderId,
      id: orderId,
      createdAt: new Date().toISOString(),
      ownerEmail: user?.email,
      customer: { name: value('name'), email: value('email').toLowerCase(), phone: value('phone'), address: value('address'), city: value('city'), area: value('area') },
      items: orderItems(lines), subtotal, deliveryFee, method,
      branch: value('branch'), payment: method === 'delivery' ? 'Cash on delivery' : 'Pay at collection', notes: value('notes'),
    };

    setPlacing(true); setError('');
    try {
      const saved = await saveOrder(next);
      setOrder({ ...next, ...saved, customer: { ...next.customer, ...(saved.customer?.name ? saved.customer : {}) } });
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (problem) {
      if (problem.code === 'LOGIN_REQUIRED' || problem.status === 401) {
        navigate('/login', { state: { from: '/checkout', message: 'Your session has expired. Please login again to place your order.' } });
        return;
      }
      setError(problem.network ? 'We could not reach the restaurant server. Please check your connection and try again.' : problem.message || 'Your order could not be placed. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (order) {
    return (
      <section className="section container">
        <SuccessState title="Your order is on its way to the kitchen." link="/orders" linkText="View my orders">
          <p>Thanks, {order.customer.name}. Order <strong>{order.code || order.id}</strong> has been received by Caf&eacute; 007.</p>
          <div className="preview-notice"><Info size={19} /><p>The branch will call you on {order.customer.phone} to confirm your order. Payment is collected on delivery or at collection.</p></div>
          <p>Need it faster? Call the branch directly.</p>
          <a className="text-link" href={telephone(restaurant.phones[0])}><Phone size={17} />{restaurant.phones[0]}</a>
        </SuccessState>
      </section>
    );
  }

  if (!lines.length) {
    return (
      <section className="section container empty-page">
        <ShoppingBag size={44} />
        <h1>First, something delicious.</h1>
        <p>Add your favourites to the cart before checking out.</p>
        <Link className="button button-dark" to="/menu">Browse the menu<ArrowRight size={17} /></Link>
      </section>
    );
  }

  return (
    <>
      <PageHeading eyebrow="Checkout" title="Let's make it a good meal." description="A few details, and your order is on its way." />
      <section className="section">
        <div className="container">
          <Link className="text-link back-link" to="/cart"><ArrowLeft size={15} />Back to your cart</Link>
          <form onSubmit={submit} className="checkout-layout">
            <div className="checkout-form">
              <section className="form-section">
                <h2><span>01</span>Your details</h2>
                <div className="form-grid">
                  <Field label="Full name" name="name" autoComplete="name" required minLength={2} maxLength={100} defaultValue={user?.name} placeholder="Your full name" />
                  <Field label="Phone number" name="phone" type="tel" autoComplete="tel" required maxLength={20} defaultValue={user?.phone} placeholder="03XX-XXXXXXX" />
                  <Field label="Email address" name="email" type="email" autoComplete="email" required defaultValue={user?.email} className="span-two" placeholder="you@example.com" />
                </div>
              </section>

              <section className="form-section">
                <h2><span>02</span>How would you like it?</h2>
                <div className="fulfilment-options">
                  <button type="button" className={method === 'delivery' ? 'selected' : ''} onClick={() => setMethod('delivery')} aria-pressed={method === 'delivery'}>
                    <Truck size={23} />
                    <div><strong>Delivery</strong><small>Good food, at your door</small></div>
                  </button>
                  <button type="button" className={method === 'pickup' ? 'selected' : ''} onClick={() => setMethod('pickup')} aria-pressed={method === 'pickup'}>
                    <MapPin size={23} />
                    <div><strong>Collection</strong><small>Pick it up at the branch</small></div>
                  </button>
                </div>
                <div className="form-grid">
                  <div className="field span-two">
                    <label htmlFor="checkout-branch">Your branch <span className="required-mark">*</span></label>
                    <select name="branch" id="checkout-branch" required defaultValue="mailsi">
                      {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.menuLabel}</option>)}
                    </select>
                  </div>
                  {method === 'delivery' && (
                    <>
                      <Field label="Street address" name="address" autoComplete="street-address" required minLength={5} maxLength={250} defaultValue={user?.address} className="span-two" placeholder="House, street, and nearby landmark" />
                      <Field label="City" name="city" autoComplete="address-level2" required defaultValue="Mailsi" />
                      <Field label="Area / landmark" name="area" placeholder="Optional, to help us find you" maxLength={150} />
                    </>
                  )}
                  <div className="field span-two">
                    <label htmlFor="order-notes">Anything else we should know?</label>
                    <textarea id="order-notes" name="notes" rows={3} maxLength={500} placeholder="Delivery instructions or a special request (optional)" />
                  </div>
                </div>
                <p className="muted small-text">Delivery coverage and collection availability are confirmed by your selected branch.</p>
              </section>

              <section className="form-section">
                <h2><span>03</span>Payment</h2>
                <label className="payment-choice">
                  <input type="radio" name="payment" value="cash" defaultChecked />
                  <Banknote size={25} />
                  <div><strong>{method === 'delivery' ? 'Cash on delivery' : 'Pay at collection'}</strong><p>Pay when your food arrives. No online payment needed.</p></div>
                </label>
              </section>

              {error && <p className="form-error" role="alert">{error}</p>}
              {!user && (
                <div className="preview-notice">
                  <Info size={19} />
                  <p><Link to="/login" state={{ from: '/checkout' }} className="text-link">Login</Link> or create an account to place your order. Your cart will be waiting for you.</p>
                </div>
              )}
            </div>

            <OrderSummary method={method} showItems>
              <button type="submit" className="button button-dark full-width" disabled={placing}>
                {placing ? 'Placing your order...' : user ? 'Place order' : 'Login to place order'}<ArrowRight size={18} />
              </button>
              <p className="summary-bottom-note">Cash on delivery orders below Rs. 500 include Rs. 100 delivery. Orders of Rs. 500 or more get free delivery.</p>
            </OrderSummary>
          </form>
        </div>
      </section>
    </>
  );
}