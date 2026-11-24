import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth({ register = false, admin = false }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate();
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const user = await login(form, register ? '/auth/register' : '/auth/login');
      if (admin && user.role !== 'admin') { localStorage.removeItem('civicToken'); window.location.href = '/department-login'; return; }
      if (!admin && user.role === 'admin') { navigate('/admin'); return; }
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) { setError(err.response?.data?.message || 'Unable to continue. Please try again.'); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><section className="auth-intro"><div className="brand light"><MapPin/> Civic Sync</div><h1>A better city<br/>starts with you.</h1><p>Report problems in your city and track them until they are fixed.</p><div className="intro-label">HOW IT WORKS</div><ol><li>Report an issue with a photo and location</li><li>The department reviews and acts</li><li>Get updates until it is resolved</li></ol><small>STUDENT PROJECT · NOT AN OFFICIAL GOVERNMENT SERVICE</small></section>
    <section className="auth-panel"><form className="auth-form" onSubmit={submit}><h2>{admin ? 'Department sign in' : register ? 'Join your city’s change.' : 'Welcome back.'}</h2><p>{admin ? 'For authorised department staff only.' : register ? 'Create an account to report and track local issues.' : 'Log in to make your neighbourhood better.'}</p>
      {register && <><label>Full name<input name="name" value={form.name} onChange={change} required placeholder="Your full name"/></label><label>Phone number<input name="phone" value={form.phone} onChange={change} placeholder="Phone number"/></label></>}
      <label>Email<input type="email" name="email" value={form.email} onChange={change} required placeholder="you@example.com"/></label><label>Password<input type="password" name="password" value={form.password} onChange={change} required minLength="8" placeholder="At least 8 characters"/></label>
      {error && <div className="error">{error}</div>}<button className="primary full" disabled={busy}>{busy ? 'Please wait...' : register ? 'Create account' : 'Log in'}</button>
      {!admin && <div className="auth-switch">{register ? 'Already have an account?' : 'New here?'} <Link to={register ? '/login' : '/register'}>{register ? 'Log in' : 'Create an account'}</Link></div>}
      {!admin && <div className="auth-switch"><Link to="/department-login">Department login</Link></div>}
      <small className="auth-foot">Your city. Your voice. A shared responsibility.</small>
    </form></section></div>;
}
