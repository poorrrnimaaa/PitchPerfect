import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Brand from './Brand';
import Icon from './Icon';

export default function AppHeader() {
  const { token, logout } = useAuthStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMarketing = location.pathname === '/';
  const isAuth = ['/login', '/signup'].includes(location.pathname);
  if (isAuth) return null;
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`site-header ${isMarketing ? 'site-header--marketing' : ''}`}>
      <div className="container header-inner">
        <Brand />
        {isMarketing ? (
          <nav className="marketing-nav" aria-label="Main navigation">
            <a href="#product">Product</a><a href="#features">Features</a><a href="#stories">Stories</a><a href="#faq">FAQ</a>
          </nav>
        ) : token ? (
          <nav className="product-nav" aria-label="Product navigation"><NavLink to="/dashboard"><Icon name="dashboard" size={17}/>Dashboard</NavLink></nav>
        ) : null}
        <div className="header-actions">
          {token ? <><>{isMarketing && <Link className="button button--ghost button--sm" to="/dashboard">Dashboard</Link>}</><button className="icon-button header-logout" onClick={handleLogout} aria-label="Log out" title="Log out"><Icon name="logout" size={18}/></button></> : <><Link className="button button--ghost button--sm header-login" to="/login">Log in</Link><Link className="button button--primary button--sm" to="/signup">Start practicing <Icon name="arrowRight" size={16}/></Link></>}
          {isMarketing && <button className="icon-button mobile-menu-button" onClick={() => setMenuOpen(prev => !prev)} aria-expanded={menuOpen} aria-label="Toggle navigation"><Icon name={menuOpen ? 'close' : 'bars'} /></button>}
        </div>
      </div>
      {isMarketing && menuOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><a href="#product" onClick={() => setMenuOpen(false)}>Product</a><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><a href="#stories" onClick={() => setMenuOpen(false)}>Stories</a><a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a></nav>}
    </header>
  );
}
