import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '▦', end: true },
  { to: '/catalog', label: 'Menu (foods & deals)', icon: '☰' },
  { to: '/orders', label: 'Orders & reservations', icon: '🛒' },
  { to: '/people', label: 'Customers & branches', icon: '⚑' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Layout({ children, onLogout }) {
  const navigate = useNavigate();

  function logout() {
    onLogout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-mark">007</span>
          <div>
            <strong>CAF&Eacute; 007</strong>
            <small>Admin panel</small>
          </div>
        </div>

        <nav className="admin-nav">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <a href="http://localhost:5173" target="_blank" rel="noreferrer">View website ↗</a>
          <button type="button" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}