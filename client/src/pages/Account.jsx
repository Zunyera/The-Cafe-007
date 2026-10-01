import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Check, ChevronDown, Info, LogOut, Package, ShoppingBag, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getOrders, refreshOrders } from '../data/orders.js';
import { branches } from '../data/restaurant.js';
import { money, validPhone } from '../utils/format.js';
import { Field, FoodImage, PageHeading } from '../components/ui.jsx';

export function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    if (!user) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    if (name.length < 2) { setError('Please enter your full name.'); return; }
    if (phone && !validPhone(phone)) { setError('Please enter a valid phone number.'); return; }
    updateUser({ ...user, name, phone, address: String(data.get('address') || '').trim() });
    setSaved(true);
    setError('');
  }

  if (!user) {
    return (
      <section className="section container empty-page">
        <UserRound size={46} />
        <h1>Your own corner of the caf&eacute;.</h1>
        <p>Login to your account or create one to get started.</p>
        <div className="button-group">
          <Link className="button button-dark" to="/login">Login<ArrowRight size={17} /></Link>
          <Link className="button button-outline" to="/signup">Create account</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeading eyebrow="Your profile" title={`Hey, ${user.name.split(' ')[0]}. Pull up a chair.`} description="Your details, your favourites, your next great hangout." />
      <section className="section">
        <div className="container account-layout">
          <aside className="account-nav">
            <div className="profile-avatar">{user.name[0].toUpperCase()}</div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <Link className="active" to="/profile"><UserRound size={18} />My profile</Link>
            <Link to="/orders"><Package size={18} />My orders</Link>
            <Link to="/my-reservations"><CalendarDays size={18} />My reservations</Link>
            <button onClick={() => { logout(); navigate('/login'); }}><LogOut size={18} />Logout</button>
          </aside>

          <div className="profile-form-wrap">
            {location.state?.created && <p className="inline-success"><Check size={18} />Your account is ready. Welcome to the hangout.</p>}
            <h2>The person behind the cravings.</h2>
            <p className="form-intro">Keep your details ready for your next order.</p>
            <form className="stack-form" onSubmit={submit} onChange={() => setSaved(false)}>
              <div className="form-grid">
                <Field label="Full name" name="name" required minLength={2} maxLength={100} defaultValue={user.name} autoComplete="name" />
                <Field label="Phone number" name="phone" type="tel" maxLength={20} defaultValue={user.phone} autoComplete="tel" />
                <Field label="Email address" name="email" type="email" readOnly value={user.email} className="span-two" />
                <Field label="Default address (optional)" name="address" maxLength={250} defaultValue={user.address} autoComplete="street-address" className="span-two" />
              </div>
              {error && <p role="alert" className="form-error">{error}</p>}
              {saved && <p className="inline-success" role="status"><Check size={18} />Your profile has been updated.</p>}
              <button className="button button-dark" type="submit">Save changes<ArrowRight size={18} /></button>
              <p className="form-footnote"><Info size={16} />Your email is your login and cannot be changed here.</p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export function Orders() {
  const { user } = useAuth();
  const [, setRefreshed] = useState(0);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    refreshOrders().finally(() => setRefreshed(value => value + 1));
  }, []);

  const orders = getOrders();

  return (
    <>
      <PageHeading eyebrow="Your orders" title="A history of good choices." description="Every order you've placed with Café 007, all in one place." />
      <section className="section">
        <div className="container orders-container">
          {orders.length ? (
            <>
              {!user && (
                <p className="preview-notice">
                  <Info size={19} />
                  <span>You are not logged in. Only orders placed on this device are shown. <Link to="/login" className="text-link">Login</Link> to see your full order history.</span>
                </p>
              )}

              <div className="orders-list">
                {orders.map(order => {
                  const orderId = order.id || order._id;
                  const orderCode = order.code || order.id || order._id;
                  const createdAt = order.createdAt || new Date().toISOString();
                  const items = Array.isArray(order.items) ? order.items : [];
                  const method = order.method || (order.customer?.address ? 'delivery' : 'pickup');
                  const customer = order.customer || {
                    name: order.user?.name || 'Customer',
                    email: order.user?.email || '',
                    phone: order.phone || '',
                    address: order.deliveryAddress || '',
                    city: '',
                    area: '',
                  };
                  const subtotal = typeof order.subtotal === 'number'
                    ? order.subtotal
                    : items.reduce((sum, item) => sum + (item.unitPrice || item.price || 0) * (item.quantity || 0), 0);
                  const deliveryFee = typeof order.deliveryFee === 'number'
                    ? order.deliveryFee
                    : Math.max(0, (order.totalAmount || subtotal) - subtotal);
                  const payment = order.payment || order.paymentMethod || 'Cash on delivery';

                  return (
                    <article className="order-card" key={orderId}>
                      <div className="order-card-heading">
                        <div>
                          <p className="eyebrow">{new Date(createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}</p>
                          <h2>{orderCode}</h2>
                        </div>
                        <span className="order-status">{order.status || 'Pending'}</span>
                      </div>

                      <div className="order-card-overview">
                        <div className="order-thumbnails">
                          {items.slice(0, 3).map((item, index) => (
                            <FoodImage
                              src={item.image}
                              alt={item.name}
                              key={`${item.productId || item.food || index}-${index}`}
                            />
                          ))}
                        </div>

                        <div>
                          <p>{items.reduce((count, item) => count + (item.quantity || 0), 0)} items &middot; {method === 'pickup' ? 'Collection' : 'Delivery'}</p>
                          <strong>{money(subtotal + deliveryFee)}</strong>
                        </div>

                        <button
                          className="text-link"
                          onClick={() => setOpenId(openId === orderId ? null : orderId)}
                          aria-expanded={openId === orderId}
                        >
                          View details
                          <ChevronDown size={17} className={openId === orderId ? 'rotate-icon' : ''} />
                        </button>
                      </div>

                      {openId === orderId && (
                        <div className="order-expanded">
                          <div className="summary-items">
                            {items.map((item, index) => (
                              <div key={`${item.productId || item.food || index}-${index}`}>
                                <div>
                                  {item.productId || item.food ? (
                                    <Link to={`/food/${item.productId || item.food}`}>
                                      <strong>{item.quantity} &times; {item.name}</strong>
                                    </Link>
                                  ) : (
                                    <strong>{item.quantity} &times; {item.name}</strong>
                                  )}
                                  <small>{[item.variant || item.selectedSize, item.flavour].filter(Boolean).join(' / ')}</small>
                                </div>
                                <span>{money((item.unitPrice || item.price || 0) * (item.quantity || 0))}</span>
                              </div>
                            ))}
                          </div>

                          <div className="order-address">
                            <h3>{method === 'pickup' ? 'Collection at' : 'Delivery details'}</h3>
                            <p>{branches.find(branch => branch.id === order.branch)?.menuLabel || order.branch?.name || order.branch || 'Branch to be confirmed'}</p>
                            {method !== 'pickup' && customer.address && (
                              <p>{[customer.address, customer.area, customer.city].filter(Boolean).join(', ')}</p>
                            )}
                            <p>{customer.name} &middot; {customer.phone}</p>
                            <p>{payment}</p>
                            {deliveryFee > 0 && <p>Delivery fee: {money(deliveryFee)}</p>}
                            {order.notes && <p>Note: {order.notes}</p>}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              <Link className="text-link" to="/menu">Order something new<ArrowRight size={17} /></Link>
            </>
          ) : (
            <div className="empty-page">
              <div className="empty-illustration"><ShoppingBag size={49} strokeWidth={1.4} /></div>
              <h2>No orders yet.</h2>
              <p>Your Café 007 orders will show up here. Ready for your first one?</p>
              <Link className="button button-dark" to="/menu">Explore the menu<ArrowRight size={18} /></Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}