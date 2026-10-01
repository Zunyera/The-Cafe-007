import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Eye, EyeOff, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { validPhone } from '../utils/format.js';
import { Field, Logo, Modal } from '../components/ui.jsx';
import { images } from '../data/images.js';

function AuthLayout({ children }) {
  return (
    <section className="auth-section">
      <div className="container auth-layout">
        <div className="auth-visual">
          <img src={images.hero} alt="A Café 007 inspired feast of burgers, fries and pizza" />
          <div className="auth-visual-copy">
            <Logo />
            <p className="eyebrow">A seat at the good-food table</p>
            <h2>Your favourites.<br />Your people.<br />Your Caf&eacute; 007.</h2>
            <span className="handwritten">Let's Hangout...</span>
          </div>
        </div>
        <div className="auth-form">{children}</div>
      </div>
    </section>
  );
}

function PasswordField({ label, name }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="field">
      <label htmlFor={name}>{label} <span className="required-mark">*</span></label>
      <div className="password-input">
        <input id={name} name={name} type={visible ? 'text' : 'password'} required minLength={8} maxLength={128} autoComplete={name === 'login-password' ? 'current-password' : 'new-password'} placeholder="At least 8 characters" />
        <button type="button" className="icon-button" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={() => setVisible(!visible)}>
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </div>
  );
}

function friendlyError(problem, fallback) {
  if (problem?.network) return 'We could not reach the restaurant server. Please make sure the backend is running and try again.';
  return problem?.message || fallback;
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/profile';
  const notice = location.state?.message || '';
  const [forgot, setForgot] = useState(false);
  const [reset, setReset] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    try {
      await login(String(data.get('email')).trim().toLowerCase(), String(data.get('login-password') || ''));
      navigate(redirectTo, { replace: true });
    } catch (problem) {
      setError(friendlyError(problem, 'Login failed. Please try again.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <p className="eyebrow">Welcome to the hangout</p>
      <h1>Good to see you again.</h1>
      <p className="auth-description">Your favourites are waiting. Let's get you in.</p>
      {notice && <p className="inline-success"><Info size={18} />{notice}</p>}
      <form onSubmit={submit} className="stack-form">
        <Field label="Email address" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        <PasswordField label="Password" name="login-password" />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="button" className="forgot-button text-link" onClick={() => { setForgot(true); setReset(false); }}>Forgot password?</button>
        <button type="submit" className="button button-dark full-width" disabled={busy}>{busy ? 'Logging in...' : 'Login'}<ArrowRight size={18} /></button>
      </form>
      <p className="auth-switch">New to the table? <Link to="/signup" state={location.state}>Create an account</Link></p>
      <p className="auth-demo-note"><Info size={16} />Your details are kept safe. We only use them to manage your orders and reservations.</p>

      <Modal open={forgot} onClose={() => setForgot(false)} title="Reset your password" className="small-modal">
        {reset ? (
          <div className="reset-success">
            <Check size={34} />
            <h2>Request received.</h2>
            <p>Please contact the branch to reset your password. Online reset will be available soon.</p>
            <button className="button button-yellow" onClick={() => setForgot(false)}>Back to login</button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Let's get you back in</p>
            <h2>Forgot your password?</h2>
            <p>Enter your account email and we will help you get back in.</p>
            <form className="stack-form" onSubmit={event => { event.preventDefault(); setReset(true); }}>
              <Field label="Email address" name="reset-email" type="email" required placeholder="you@example.com" />
              <button className="button button-dark full-width" type="submit">Continue<ArrowRight size={17} /></button>
            </form>
          </>
        )}
      </Modal>
    </AuthLayout>
  );
}

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/profile';
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    if (name.length < 2) { setError('Please enter your full name.'); return; }
    if (!validPhone(phone)) { setError('Please enter a valid phone number.'); return; }
    if (data.get('signup-password') !== data.get('confirm-password')) { setError('Your passwords do not match. Please try again.'); return; }
    setBusy(true);
    setError('');
    try {
      await signup({ name, email: String(data.get('email')).trim().toLowerCase(), phone, password: String(data.get('signup-password') || '') });
      navigate(redirectTo, { replace: true, state: { created: true } });
    } catch (problem) {
      setError(friendlyError(problem, 'Account could not be created. Please try again.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <p className="eyebrow">There's always room for one more</p>
      <h1>Join the good-food club.</h1>
      <p className="auth-description">Create your profile and make yourself at home.</p>
      <form className="stack-form signup-form" onSubmit={submit}>
        <Field label="Full name" name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Your full name" />
        <Field label="Email address" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        <Field label="Phone number" name="phone" type="tel" required maxLength={20} autoComplete="tel" placeholder="03XX-XXXXXXX" />
        <div className="form-grid">
          <PasswordField label="Password" name="signup-password" />
          <PasswordField label="Confirm password" name="confirm-password" />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button button-dark full-width" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}<ArrowRight size={18} /></button>
      </form>
      <p className="auth-switch">Already have a seat? <Link to="/login" state={location.state}>Login</Link></p>
      <p className="auth-demo-note"><Info size={16} />Your password is stored securely and never shared.</p>
    </AuthLayout>
  );
}