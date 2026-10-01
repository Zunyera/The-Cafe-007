import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { clearAdminSession, getAdminUser, getToken } from './api.js';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Catalog from './pages/Catalog.jsx';
import Orders from './pages/Orders.jsx';
import People from './pages/People.jsx';
import Settings from './pages/Settings.jsx';

function Protected({ children }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const adminUser = getAdminUser();

    if (!token || !adminUser || adminUser.role !== 'admin') {
      clearAdminSession();
      navigate('/login', { replace: true });
      return;
    }

    setReady(true);
  }, [navigate]);

  return ready ? children : null;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <Protected>
              <Layout onLogout={() => clearAdminSession()}>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="catalog" element={<Catalog />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="people" element={<People />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </Protected>
          }
        />
      </Routes>
    </HashRouter>
  );
}