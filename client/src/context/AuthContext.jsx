import { createContext, useContext, useState } from 'react';
import { readLocal, writeLocal } from '../utils/format.js';
import { getToken, loginRemote, registerRemote, setToken, updateRemoteProfile } from '../services/api.js';

const AuthContext = createContext(null);

/* A session only counts when the backend token is present. This prevents "logged in" profiles
   that cannot place orders or reservations (which are protected API routes). */
function restoreUser() {
  if (!getToken()) return null;
  const saved = readLocal('cafe007.session', null);
  return saved && typeof saved.email === 'string' && saved.email.includes('@') && typeof saved.name === 'string' && saved.name.trim().length > 0 ? saved : null;
}

function toLocalUser(user) {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreUser);

  function saveLocal(next) {
    setUser(next);
    writeLocal('cafe007.session', next);
  }

  // Both signup and login talk to the real API. If the API is unreachable the error is shown to the user
  // instead of silently creating a local-only profile.
  async function signup(next) {
    const data = await registerRemote({ ...next, password: next.password });
    setToken(data.token);
    saveLocal(toLocalUser(data.user));
  }

  async function login(email, password) {
    const data = await loginRemote(email, password);
    setToken(data.token);
    saveLocal(toLocalUser(data.user));
  }

  async function updateUser(next) {
    saveLocal(next);
    try {
      const data = await updateRemoteProfile(next);
      saveLocal(toLocalUser({ ...next, ...data.user }));
    } catch {
      /* the local copy already holds the change; it syncs on the next successful update */
    }
  }

  function logout() {
    setUser(null);
    setToken('');
    writeLocal('cafe007.session', null);
  }

  return <AuthContext.Provider value={{ user, signup, login, updateUser, logout, hasSession: Boolean(getToken()) }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider is required.');
  return context;
}








//4JmjMbqflMUCseKF

//mongodb+srv://zunairaaliff_db_user:4JmjMbqflMUCseKF@cluster0.fu7idca.mongodb.net/?appName=Cluster0