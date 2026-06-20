import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import API from '../api/config';
import { AuthLayout, FormField } from '../components/AuthLayout';
import Icon from '../components/Icon';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { const response = await API.post('/auth/signup', { name, email, password }); login(response.data.token, response.data.user); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'Signup failed'); }
    finally { setLoading(false); }
  };

  return <AuthLayout eyebrow="Start for free" title="Practice starts here." description="Create your account and begin a guided session in minutes.">
    <form onSubmit={handleSignup} className="auth-form">
      {error && <div className="alert alert--error" role="alert">{error}</div>}
      <FormField label="Full name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required/>
      <FormField label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/>
      <FormField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" autoComplete="new-password" required minLength={6} hint="Use at least 6 characters"/>
      <button type="submit" disabled={loading} className="button button--primary button--lg button--full">{loading ? <><span className="spinner"/> Creating account…</> : <>Create account <Icon name="arrowRight" size={18}/></>}</button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </AuthLayout>;
}
