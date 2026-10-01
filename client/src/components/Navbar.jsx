import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu as MenuIcon, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { featuredDeals, popularProducts, searchProducts } from '../data/menu.js';
import { Logo, Modal } from './ui.jsx';
import FoodCard from './FoodCard.jsx';

const links = [['Home', '/'], ['Menu', '/menu'], ['Deals', '/deals'], ['Branches', '/branches'], ['About', '/about'], ['Contact', '/contact'], ['Reservations', '/reservation']];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { count } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const results = searchProducts(query);
  const suggestions = query.trim() ? results.slice(0, 6) : [...popularProducts, ...featuredDeals.slice(0, 2)];
  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [location.pathname, location.search]);
  useEffect(() => {
    function onKey(event) { if (event.key === 'Escape') setMobileOpen(false); }
    function onResize() { if (window.innerWidth >= 1100) setMobileOpen(false); }
    window.addEventListener('keydown', onKey); window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, []);

  return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><div className="container navbar">
    <Link className="logo-link" to="/" aria-label="Café 007 home"><Logo /></Link>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, to]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}</nav>
    <div className="header-actions"><button className="icon-button" aria-label="Search the menu" onClick={() => { setSearchOpen(true); setMobileOpen(false); }}><Search size={21} /></button><Link className="icon-button cart-link" to="/cart" aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}><ShoppingBag size={21} /><span className="cart-count" aria-live="polite">{count}</span></Link><span className="nav-divider" /><Link className="login-link" to={user ? '/profile' : '/login'}><UserRound size={18} /><span>{user ? 'My account' : 'Login'}</span></Link><button className="icon-button mobile-toggle" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}</button></div>
  </div><AnimatePresence>{mobileOpen && <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}><div className="container">{links.map(([label, to]) => <NavLink key={to} to={to} end={to === '/'}>{label}<ArrowRight size={16} /></NavLink>)}<NavLink to={user ? '/profile' : '/login'}>{user ? 'My profile' : 'Login / Sign up'}<UserRound size={16} /></NavLink><NavLink to="/orders">My orders<ShoppingBag size={16} /></NavLink></div></motion.nav>}</AnimatePresence></header>
    <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Search the Café 007 menu" className="search-modal"><p className="eyebrow">Find your flavour</p><h2>What are you craving?</h2><form className="search-input" onSubmit={event => { event.preventDefault(); navigate(`/menu?q=${encodeURIComponent(query.trim())}`); setSearchOpen(false); }}><Search size={22} /><input data-autofocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Try zinger, pizza, shawarma..." aria-label="Search food names, categories, and keywords" />{query && <button type="button" className="icon-button" onClick={() => setQuery('')} aria-label="Clear search"><X size={18} /></button>}<button type="submit" className="search-submit" aria-label="See all results"><ArrowRight size={19} /></button></form>
      <div className="search-results-heading"><span>{query.trim() ? `${results.length} delicious matches` : 'A few favourites to get you started'}</span><Link to={`/menu?q=${encodeURIComponent(query)}`} className="text-link" onClick={() => setSearchOpen(false)}>View all<ArrowRight size={14} /></Link></div>
      {results.length ? <div className="food-grid search-grid">{suggestions.map(product => <FoodCard key={product.id} product={product} onAdd={() => setSearchOpen(false)} />)}</div> : <div className="empty-search"><Search size={32} /><h3>No bites found.</h3><p>Try a different food name or a category like "Burgers".</p><button className="button button-yellow" onClick={() => setQuery('')}>Clear search</button></div>}
    </Modal>
  </>;
}