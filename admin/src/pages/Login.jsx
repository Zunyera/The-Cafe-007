import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAdminUser, setToken } from '../api.js';

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const data = new FormData(event.currentTarget);

    try {
      const result = await api.post('/auth/login', {
        email: String(data.get('email') || '').trim().toLowerCase(),
        password: String(data.get('password') || ''),
      });

      if (result.user?.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }

      setToken(result.token);
      setAdminUser(result.user);
      navigate('/', { replace: true });
    } catch (problem) {
      setError(problem.message || 'Login failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <span className="admin-brand-mark large">007</span>
        <p className="admin-eyebrow">Quality is our recipe</p>
        <h1>CAF&Eacute; 007 Admin</h1>
        <p className="admin-login-note">Manage orders, bookings, menu and branches from here.</p>

        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="admin@cafe007.com" />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="current-password" placeholder="At least 8 characters" />

        {error && <p className="admin-error" role="alert">{error}</p>}

        <button type="submit" className="admin-button" disabled={busy}>
          {busy ? 'Checking...' : 'Login to dashboard'}
        </button>

       <p className="admin-hint">Only authorized admin accounts can access this dashboard.</p>
      </form>
    </div>
  );
}