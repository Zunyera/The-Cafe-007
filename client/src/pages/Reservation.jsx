import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, Info, MapPin, Phone } from 'lucide-react';
import { branches, restaurant } from '../data/restaurant.js';
import { useAuth } from '../context/AuthContext.jsx';
import { localDate, telephone, validPhone, writeLocal } from '../utils/format.js';
import { getToken, submitReservation } from '../services/api.js';
import { Field, FoodImage, PageHeading, SuccessState } from '../components/ui.jsx';
import { images } from '../data/images.js';

export default function Reservation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [request, setRequest] = useState(null);
  const [sending, setSending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key) => String(data.get(key) || '').trim();
    if (!validPhone(value('phone'))) { setError('Please enter a valid phone number so your branch can contact you.'); return; }
    if (new Date(`${value('date')}T${value('time')}`).getTime() <= Date.now()) { setError('Please choose a date and time in the future.'); return; }
    if (value('name').length < 2) { setError('Please enter your full name.'); return; }
    if (!user || !getToken()) { navigate('/login', { state: { from: '/reservation', message: 'Please login to request a table.' } }); return; }

    const next = { name: value('name'), date: value('date'), time: value('time'), guests: value('guests'), branch: value('branch') };
    const savedRequest = { ...next, phone: value('phone'), specialRequest: value('request'), createdAt: new Date().toISOString() };
    setSending(true); setError('');
    try {
      await submitReservation(savedRequest);
      writeLocal('cafe007.reservation', savedRequest);
      setRequest(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (problem) {
      if (problem.status === 401) { navigate('/login', { state: { from: '/reservation', message: 'Your session has expired. Please login again.' } }); return; }
      setError(problem.network ? 'We could not reach the restaurant server. Please check your connection and try again.' : problem.message || 'Your table request could not be sent. Please try again.');
    } finally {
      setSending(false);
    }
  }

  if (request) {
    const branchName = branches.find(branch => branch.id === request.branch)?.name;
    const when = new Date(`${request.date}T${request.time}`).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
    return (
      <section className="section container">
        <SuccessState title="A good hangout starts here." link="/menu" linkText="Plan your meal">
          <p>Thanks, {request.name}! Your table request for <strong>{request.guests} guests</strong> at <strong>{branchName}</strong> on <strong>{when}</strong> has been received.</p>
          <div className="preview-notice"><Info size={20} /><p>Your branch will confirm availability and call you back on the number you provided.</p></div>
          {request.branch === 'mailsi' && <a className="text-link" href={telephone(restaurant.phones[0])}><Phone size={17} />Call Mailsi: {restaurant.phones[0]}</a>}
        </SuccessState>
        <button className="text-link centered-link" onClick={() => { setRequest(null); setError(''); }}>Make another request<ArrowRight size={16} /></button>
        <Link className="text-link centered-link" to="/my-reservations">View my reservations<ArrowRight size={16} /></Link>
      </section>
    );
  }

  return (
    <>
      <PageHeading eyebrow="Save a seat" title="The best plans start around a table." description="Catch up, celebrate, or just come hungry. Make your next hangout a Café 007 hangout." />
      <section className="section">
        <div className="container reservation-layout">
          <div className="reservation-intro">
            <FoodImage src={images.hangout} alt="Friends enjoying a relaxed meal together" />
            <p className="eyebrow">Bring your favourite people</p>
            <h2>We'll make room<br />for good times.</h2>
            <p>Choose your branch, tell us when, and let the food do the rest. Table availability and opening hours are confirmed by the branch.</p>
            <p className="reservation-address"><MapPin size={20} />{restaurant.address}</p>
            <a className="text-link" href={telephone(restaurant.phones[0])}><Phone size={17} />{restaurant.phones[0]}</a>
          </div>

          <form className="reservation-form" onSubmit={submit}>
            <div className="form-title"><CalendarDays size={27} /><h2>Let's plan your visit</h2></div>
            <div className="form-grid">
              <Field label="Full name" name="name" required minLength={2} maxLength={100} autoComplete="name" defaultValue={user?.name} placeholder="Your full name" />
              <Field label="Phone number" name="phone" type="tel" required maxLength={20} autoComplete="tel" defaultValue={user?.phone} placeholder="03XX-XXXXXXX" />
              <Field label="Date" name="date" type="date" required min={localDate()} />
              <Field label="Preferred time" name="time" type="time" required />
              <Field label="Number of guests" name="guests" type="number" min={1} max={99} defaultValue={2} required />
              <div className="field">
                <label htmlFor="reservation-branch">Branch <span className="required-mark">*</span></label>
                <select name="branch" id="reservation-branch" defaultValue="mailsi" required>
                  {branches.map(branch => <option value={branch.id} key={branch.id}>{branch.menuLabel}</option>)}
                </select>
              </div>
              <div className="field span-two">
                <label htmlFor="special-request">Make it a little special (optional)</label>
                <textarea id="special-request" name="request" rows={4} maxLength={800} placeholder="A birthday, a window seat, a high chair... let us know." />
              </div>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {!user && (
              <p className="form-footnote">
                <Info size={15} />
                <Link to="/login" state={{ from: '/reservation' }} className="text-link">Login</Link> or create an account so we can save your table request to your profile.
              </p>
            )}
            <button type="submit" className="button button-dark full-width" disabled={sending}>
              {sending ? 'Sending your request...' : user ? 'Request a table' : 'Login to request a table'}<ArrowRight size={18} />
            </button>
            <p className="form-footnote"><Info size={15} />Your branch will confirm your table. Opening hours vary by location.</p>
          </form>
        </div>
      </section>
    </>
  );
}