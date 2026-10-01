import { useState } from 'react';
import { api, getAdminUser, setAdminUser, setToken } from '../api.js';

export default function Settings() {
  const current = getAdminUser() || {};
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setSaved('');
    setError('');

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim().toLowerCase(),
      phone: String(data.get('phone') || '').trim(),
      currentPassword: String(data.get('currentPassword') || ''),
      newPassword: String(data.get('newPassword') || ''),
    };

    try {
      const result = await api.put('/auth/settings', payload);
      if (result.user) setAdminUser(result.user);
      if (result.token) setToken(result.token);
      setSaved('Settings updated successfully.');
    } catch (problem) {
      setError(problem.message || 'Could not update settings.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Account</p>
          <h1>Settings</h1>
        </div>
      </header>

      <section className="admin-panel">
        <h2>Admin account settings</h2>
        <form className="admin-form-grid" onSubmit={submit}>
          <label>
            Full name
            <input name="name" type="text" required minLength={2} maxLength={100} defaultValue={current.name || ''} />
          </label>

          <label>
            Email address
            <input name="email" type="email" required defaultValue={current.email || ''} />
          </label>

          <label>
            Phone number
            <input name="phone" type="text" maxLength={20} defaultValue={current.phone || ''} />
          </label>

          <label>
            Current password
            <input name="currentPassword" type="password" autoComplete="current-password" placeholder="Required only to change password" />
          </label>

          <label>
            New password
            <input name="newPassword" type="password" minLength={8} autoComplete="new-password" placeholder="Leave blank to keep current password" />
          </label>

          {error && <p className="admin-error">{error}</p>}
          {saved && <p className="admin-success">{saved}</p>}

          <div>
            <button type="submit" className="admin-button" disabled={busy}>
              {busy ? 'Saving...' : 'Save settings'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}