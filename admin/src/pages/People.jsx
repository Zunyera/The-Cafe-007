import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { dateOnly } from '../utils.js';

const emptyBranch = { name: '', address: '', phone: '', openingHours: '', deliveryAvailable: false, isActive: true };

export default function People() {
  const [tab, setTab] = useState('customers');
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  function load() {
    api.get('/admin/customers').then(data => setCustomers(data.customers)).catch(problem => setError(problem.message));
    api.get('/branches?includeInactive=1').then(data => setBranches(data.branches)).catch(problem => setError(problem.message));
  }
  useEffect(load, []);

  async function toggleCustomer(customer) {
    try {
      const data = await api.put(`/admin/customers/${customer._id}/status`, { isActive: !customer.isActive });
      setCustomers(list => list.map(item => (item._id === customer._id ? data.customer : item)));
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function saveBranch(event) {
    event.preventDefault();
    try {
      if (editing._id) await api.put(`/branches/${editing._id}`, editing);
      else await api.post('/branches', editing);
      setEditing(null);
      load();
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function removeBranch(branch) {
    if (!window.confirm(`Delete ${branch.name} branch?`)) return;
    try {
      await api.delete(`/branches/${branch._id}`);
      load();
    } catch (problem) {
      setError(problem.message);
    }
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Accounts &amp; locations</p>
          <h1>Customers &amp; branches</h1>
        </div>
        <div className="admin-tabs">
          <button type="button" className={tab === 'customers' ? 'active' : ''} onClick={() => setTab('customers')}>
            Customers ({customers.length})
          </button>
          <button type="button" className={tab === 'branches' ? 'active' : ''} onClick={() => setTab('branches')}>
            Branches ({branches.length})
          </button>
        </div>
      </header>

      {error && <p className="admin-error page" role="alert">{error}</p>}

      {tab === 'customers' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr><td colSpan={5}><em>No customers have signed up yet.</em></td></tr>
              )}
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.email}<small>{customer.phone || 'No phone'}</small></td>
                  <td>{dateOnly(customer.createdAt)}</td>
                  <td>
                    <span className={`admin-pill ${customer.isActive ? 'delivered' : 'cancelled'}`}>
                      {customer.isActive ? 'active' : 'deactivated'}
                    </span>
                  </td>
                  <td className="admin-row-actions">
                    <button type="button" onClick={() => toggleCustomer(customer)}>
                      {customer.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'branches' && (
        <>
          <div className="admin-filters">
            <span>Branches as listed on the official menu</span>
            <button type="button" className="admin-button" onClick={() => setEditing({ ...emptyBranch })}>+ New branch</button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Address</th>
                  <th>Phones</th>
                  <th>Hours</th>
                  <th>Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(branch => (
                  <tr key={branch._id}>
                    <td>
                      <strong>{branch.name}</strong>
                      {!branch.isActive && <small>Hidden on website</small>}
                    </td>
                    <td>{branch.address || <em>Not confirmed yet</em>}</td>
                    <td>{branch.phone || <em>Not listed</em>}</td>
                    <td>{branch.openingHours || <em>Confirm with branch</em>}</td>
                    <td>{branch.deliveryAvailable ? 'Yes' : 'Ask branch'}</td>
                    <td className="admin-row-actions">
                      <button type="button" onClick={() => setEditing({ ...branch })}>Edit</button>
                      <button type="button" className="danger" onClick={() => removeBranch(branch)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editing && (
        <div className="admin-modal" onMouseDown={event => { if (event.target === event.currentTarget) setEditing(null); }}>
          <form className="admin-modal-card" onSubmit={saveBranch}>
            <h2>{editing._id ? 'Edit branch' : 'New branch'}</h2>
            <div className="admin-form-grid">
              <label>
                Branch name
                <input required value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </label>
              <label>
                Phone
                <input value={editing.phone} onChange={e => setEditing({ ...editing, phone: e.target.value })} placeholder="067-3751007, 0300-1294007" />
              </label>
              <label className="wide">
                Address
                <input value={editing.address} onChange={e => setEditing({ ...editing, address: e.target.value })} placeholder="Fill in once confirmed" />
              </label>
              <label className="wide">
                Opening hours
                <input value={editing.openingHours} onChange={e => setEditing({ ...editing, openingHours: e.target.value })} placeholder="e.g. Daily 12:00 PM – 2:00 AM" />
              </label>
              <label className="admin-check">
                <input type="checkbox" checked={editing.deliveryAvailable} onChange={e => setEditing({ ...editing, deliveryAvailable: e.target.checked })} /> Delivery available
              </label>
              <label className="admin-check">
                <input type="checkbox" checked={editing.isActive} onChange={e => setEditing({ ...editing, isActive: e.target.checked })} /> Active on the website
              </label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-button ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="admin-button">Save branch</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}