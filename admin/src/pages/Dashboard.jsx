import { useEffect, useState } from 'react';
import { api, pillClass, getAdminUser } from '../api.js';
import { money } from '../utils.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const adminUser = getAdminUser();

  useEffect(() => {
    api.get('/admin/dashboard').then(setData).catch(problem => setError(problem.message));
  }, []);

  if (error) return <p className="admin-error page">{error}</p>;
  if (!data) return <p className="admin-loading">Loading dashboard...</p>;

  const cards = [
    ['Total revenue', money(data.totalRevenue)],
    ['Total orders', data.totalOrders],
    ["Today's orders", data.todayOrders],
    ['Pending orders', data.pendingOrders],
    ['Reservations', data.totalReservations],
    ['Customers', data.totalCustomers],
    ['Foods', data.totalFoods],
    ['Categories', data.totalCategories],
    ['Deals', data.totalDeals],
    ['Branches', data.totalBranches],
  ];

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Overview</p>
          <h1>Dashboard</h1>
          {adminUser?.name && <p>Welcome back, {adminUser.name}.</p>}
        </div>
      </header>

      <section className="admin-stat-grid">
        {cards.map(([label, value]) => (
          <article key={label} className="admin-stat-card">
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <h2>Recent orders</h2>
        {data.recentOrders.length === 0 ? (
          <p className="admin-empty">No orders yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Branch</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map(order => (
                  <tr key={order._id}>
                    <td><strong>{String(order._id).slice(-8).toUpperCase()}</strong></td>
                    <td>{order.user}</td>
                    <td>{order.branch}</td>
                    <td>{money(order.totalAmount)}</td>
                    <td><span className={`admin-pill ${pillClass(order.status)}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}