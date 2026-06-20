import { Link } from 'react-router-dom';
import Brand from './Brand';
import Icon from './Icon';

export function AuthLayout({ children, eyebrow, title, description }) {
  return (
    <main className="auth-page">
      <section className="auth-form-side">
        <div className="auth-top"><Brand/><Link to="/" className="text-link"><Icon name="arrowLeft" size={16}/> Back to home</Link></div>
        <div className="auth-form-wrap"><div className="auth-heading"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{children}</div>
        <p className="auth-legal">By continuing, you agree to our Terms and Privacy Policy.</p>
      </section>
      <aside className="auth-story">
        <div className="auth-story-content"><div className="auth-story-icon"><Icon name="sparkles" size={22}/></div><blockquote>“Confidence isn’t knowing every answer. It’s knowing you’ve done the work.”</blockquote><p>Practice deliberately. Show up ready.</p></div>
        <div className="auth-mini-card"><div className="auth-mini-head"><span>Weekly progress</span><strong>+12%</strong></div><div className="auth-bars"><i/><i/><i/><i/><i/><i/><i/></div><div className="auth-mini-foot"><span>6 sessions completed</span><span>Keep going</span></div></div>
      </aside>
    </main>
  );
}

export function FormField({ label, hint, ...props }) {
  return <label className="form-field"><span>{label}</span><input {...props}/>{hint && <small>{hint}</small>}</label>;
}
