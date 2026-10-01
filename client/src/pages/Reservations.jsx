import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Info, MapPin, Phone, UserRound, Users, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchMyReservations, cancelMyReservation, getToken } from '../services/api.js';
import { PageHeading } from '../components/ui.jsx';

function statusClass(status) {
  return `order-status status-${String(status || 'pending').toLowerCase()}`;
}

export default function Reservations() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    fetchMyReservations()
      .then(data => setList(data.reservations || []))
      .catch(problem => setError(problem.message || 'Could not load your reservations.'))
      .finally(() => setLoading(false));
  }, []);

  async function cancel(item) {
    if (!window.confirm('Cancel this table request?')) return;
    setBusyId(item._id);
    setError('');
    try {
      const data = await cancelMyReservation(item._id);
      setList(current => current.map(entry => (entry._id === item._id ? data.reservation : entry)));
    } catch (problem) {
      setError(problem.message || 'Could not cancel this reservation.');
    } finally {
      setBusyId('');
    }
  }

  if (!user || !getToken()) {
    return (
      <section className="section container empty-page">
        <UserRound size={46} />
        <h1>Your table requests live here.</h1>
        <p>Login to see and manage the tables you have requested.</p>
        <div className="button-group">
          <Link className="button button-dark" to="/login">Login<ArrowRight size={17} /></Link>
          <Link className="button button-outline" to="/reservation">Book a table</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeading eyebrow="Your reservations" title="Tables you have requested." description="Every table request you have made with Café 007. You can cancel a request until the branch marks it completed." />
      <section className="section">
        <div className="container orders-container">
          {error && <p className="form-error" role="alert">{error}</p>}
          {loading && <p className="muted">Loading your reservations...</p>}

          {!loading && list.length === 0 && (
            <div className="empty-page">
              <div className="empty-illustration"><CalendarDays size={46} strokeWidth={1.4} /></div>
              <h2>No table requests yet.</h2>
              <p>Plan your next hangout and we will save you a seat.</p>
              <Link className="button button-dark" to="/reservation">Book a table<ArrowRight size={18} /></Link>
            </div>
          )}

          {!loading && list.length > 0 && (
            <>
              <div className="orders-list">
                {list.map(item => {
                  const when = new Date(`${item.date}T${item.time}`);
                  const whenLabel = Number.isNaN(when.getTime()) ? `${item.date} ${item.time}` : when.toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
                  const canCancel = item.status !== 'Cancelled' && item.status !== 'Completed';
                  return (
                    <article className="order-card" key={item._id}>
                      <div className="order-card-heading">
                        <div>
                          <p className="eyebrow">Requested {new Date(item.createdAt).toLocaleDateString('en-PK', { dateStyle: 'medium' })}</p>
                          <h2>{whenLabel}</h2>
                        </div>
                        <span className={statusClass(item.status)}>{item.status}</span>
                      </div>
                      <div className="order-address">
                        <p><Users size={14} /> {item.guests} {item.guests === 1 ? 'guest' : 'guests'} &middot; {item.name}</p>
                        <p><MapPin size={14} /> {item.branch?.name ? `Café 007, ${item.branch.name}` : 'Branch to be confirmed'}</p>
                        <p><Phone size={14} /> {item.phone}</p>
                        {item.specialRequest && <p>Note: {item.specialRequest}</p>}
                      </div>
                      {canCancel && (
                        <button type="button" className="text-link remove-button" style={{ marginTop: 14, fontSize: 12 }} disabled={busyId === item._id} onClick={() => cancel(item)}>
                          <X size={15} /> {busyId === item._id ? 'Cancelling...' : 'Cancel this request'}
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
              <p className="form-footnote"><Info size={15} />The branch confirms every table by phone. Statuses update here as soon as the branch changes them.</p>
              <Link className="text-link" to="/reservation" style={{ marginTop: 18 }}>Request another table<ArrowRight size={17} /></Link>
            </>
          )}
        </div>
      </section>
    </>
  );
}