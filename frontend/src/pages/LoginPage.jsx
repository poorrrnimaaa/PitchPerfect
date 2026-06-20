import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import API from '../api/config';
import { AuthLayout, FormField } from '../components/AuthLayout';
import Icon from '../components/Icon';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { const response = await API.post('/auth/login', { email, password }); login(response.data.token, response.data.user); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'Login failed'); }
    finally { setLoading(false); }
  };

  return <AuthLayout eyebrow="Welcome back" title="Continue your progress." description="Sign in to pick up where you left off.">
    <form onSubmit={handleLogin} className="auth-form">
      {error && <div className="alert alert--error" role="alert">{error}</div>}
      <FormField label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/>
      <FormField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required/>
      <button type="submit" disabled={loading} className="button button--primary button--lg button--full">{loading ? <><span className="spinner"/> Signing in…</> : <>Sign in <Icon name="arrowRight" size={18}/></>}</button>
    </form>
    <p className="auth-switch">New to PitchPerfect? <Link to="/signup">Create an account</Link></p>
  </AuthLayout>;
}
