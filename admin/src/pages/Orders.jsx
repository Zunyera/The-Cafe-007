import { useEffect, useState } from 'react';
import { api, ORDER_STATUSES, RESERVATION_STATUSES, pillClass } from '../api.js';
import { dateOnly, money } from '../utils.js';

export default function Orders() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  function load() {
    api.get('/orders').then(data => setOrders(data.orders)).catch(problem => setError(problem.message));
    api.get('/admin/reservations').then(data => setReservations(data.reservations)).catch(problem => setError(problem.message));
  }
  useEffect(load, []);

  async function orderStatus(order, status) {
    try {
      const data = await api.put(`/orders/${order._id}/status`, { status });
      setOrders(list => list.map(item => (item._id === order._id ? data.order : item)));
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function reservationStatus(item, status) {
    try {
      const data = await api.put(`/reservations/${item._id}/status`, { status });
      setReservations(list => list.map(entry => (entry._id === item._id ? data.reservation : entry)));
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function removeReservation(item) {
    if (!window.confirm('Delete this reservation?')) return;
    try {
      await api.delete(`/reservations/${item._id}`);
      setReservations(list => list.filter(entry => entry._id !== item._id));
    } catch (problem) {
      setError(problem.message);
    }
  }

  const customerName = value => (value && typeof value === 'object' ? value.name : 'Guest');

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Kitchen &amp; tables</p>
          <h1>Orders &amp; reservations</h1>
        </div>
        <div className="admin-tabs">
          <button type="button" className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
            Orders ({orders.length})
          </button>
          <button type="button" className={tab === 'reservations' ? 'active' : ''} onClick={() => setTab('reservations')}>
            Reservations ({reservations.length})
          </button>
        </div>
      </header>

      {error && <p className="admin-error page" role="alert">{error}</p>}

      {tab === 'orders' && orders.length === 0 && <p className="admin-empty">No orders yet.</p>}

      {tab === 'orders' && orders.length > 0 && (
        <div className="admin-card-list">
          {orders.map(order => (
            <article className="admin-order-card" key={order._id}>
              <div className="admin-order-head">
                <div>
                  <strong>#{String(order._id).slice(-8).toUpperCase()}</strong>
                  <small>{dateOnly(order.createdAt)} · {customerName(order.user)} · {order.phone}</small>
                </div>
                <span className={`admin-pill ${pillClass(order.status)}`}>{order.status}</span>
              </div>

              <div className="admin-order-body">
                <div>
                  <h3>Delivery</h3>
                  <p>{order.deliveryAddress || 'Collection at branch'}</p>
                  {order.branch?.name && <p>Branch: {order.branch.name}</p>}
                  <p>{order.paymentMethod}</p>
                  {order.notes && <p className="admin-note">Note: {order.notes}</p>}
                </div>
                <div>
                  <h3>Items</h3>
                  <ul>
                    {(order.items || []).map((item, index) => (
                      <li key={index}>
                        <span>
                          {item.quantity} × {item.name}
                          {item.selectedSize ? ` (${item.selectedSize})` : ''}
                          {item.flavour ? ` · ${item.flavour}` : ''}
                        </span>
                        <em>{money(item.price * item.quantity)}</em>
                      </li>
                    ))}
                  </ul>
                  <p className="admin-total">Total <strong>{money(order.totalAmount)}</strong></p>
                </div>
              </div>

              <div className="admin-order-actions">
                <label>
                  Status
                  <select value={order.status} onChange={event => orderStatus(order, event.target.value)}>
                    {ORDER_STATUSES.map(status => <option key={status}>{status}</option>)}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'reservations' && reservations.length === 0 && <p className="admin-empty">No table requests yet.</p>}

      {tab === 'reservations' && reservations.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>When</th>
                <th>Guests</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(item => (
                <tr key={item._id}>
                  <td>
                    <strong>{item.name}</strong>
                    <small>{item.phone}{item.specialRequest ? ` · ${item.specialRequest}` : ''}</small>
                  </td>
                  <td>{item.date}<small>{item.time}</small></td>
                  <td>{item.guests}</td>
                  <td>{item.branch?.name || 'Not selected'}</td>
                  <td><span className={`admin-pill ${pillClass(item.status)}`}>{item.status}</span></td>
                  <td className="admin-row-actions">
                    <select value={item.status} onChange={event => reservationStatus(item, event.target.value)}>
                      {RESERVATION_STATUSES.map(status => <option key={status}>{status}</option>)}
                    </select>
                    <button type="button" className="danger" onClick={() => removeReservation(item)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}