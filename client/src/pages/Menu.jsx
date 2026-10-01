import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown, Search, SlidersHorizontal, Truck, X } from 'lucide-react';
import { categories, searchProducts } from '../data/menu.js';
import FoodCard from '../components/FoodCard.jsx';
import { PageHeading } from '../components/ui.jsx';

export default function MenuPage({ dealsOnly = false }) {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const active = params.get('category') || 'All';
  const [sort, setSort] = useState('menu');
  const [limit, setLimit] = useState(12);
  const options = dealsOnly ? ['All', 'Deals', 'Pizza Deals'] : ['All', 'Pizza', ...categories];
  const filtered = useMemo(() => {
    let result = searchProducts(query, active);
    if (dealsOnly) result = result.filter(product => product.category === 'Deals' || product.category === 'Pizza Deals');
    if (dealsOnly && active === 'Deals') result = result.filter(product => product.category === 'Deals');
    if (sort === 'low') result.sort((a, b) => a.price - b.price);
    if (sort === 'high') result.sort((a, b) => b.price - a.price);
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [query, active, sort, dealsOnly]);
  useEffect(() => setLimit(12), [query, active, sort, dealsOnly]);
  function updateParam(key, value) {
    setParams(previous => { const next = new URLSearchParams(previous); if (!value || value === 'All') next.delete(key); else next.set(key, value); return next; }, { replace: true });
  }
  return <>
    <PageHeading eyebrow={dealsOnly ? 'Deals worth sharing' : 'The Café 007 menu'} title={dealsOnly ? 'Good things come together.' : 'Find your next favourite.'} description={dealsOnly ? 'All 26 regular deals and 10 pizza deals, straight from our official menu.' : 'From the first crispy bite to the last cheesy slice. What are you craving?'}><p className="heading-delivery"><Truck size={18} />Free delivery on orders over Rs. 500</p></PageHeading>
    <section className="section menu-section"><div className="container">
      <div className="menu-toolbar"><div className="search-input"><Search size={20} /><input type="search" aria-label="Search menu" placeholder="Search your favourites..." value={query} onChange={event => updateParam('q', event.target.value)} />{query && <button className="icon-button" onClick={() => updateParam('q', '')} aria-label="Clear search"><X size={17} /></button>}</div><label className="sort-select"><SlidersHorizontal size={17} /><span className="sr-only">Sort products</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="menu">Menu order</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div>
      <nav className="category-tabs" aria-label="Menu categories">{options.map(category => <button className={active === category ? 'active' : ''} key={category} onClick={() => updateParam('category', category)} aria-pressed={active === category}>{category === 'All' ? (dealsOnly ? 'All deals' : 'All favourites') : category === 'Deals' && dealsOnly ? 'Regular deals' : category}</button>)}</nav>
      <div className="menu-results-bar"><h2>{query ? `Results for "${query}"` : active === 'All' ? (dealsOnly ? 'Find your perfect combo' : 'A menu made for good times') : active}</h2><p role="status">{filtered.length} {filtered.length === 1 ? 'item' : 'items'}</p></div>
      {filtered.length ? <><div className="food-grid">{filtered.slice(0, limit).map(product => <FoodCard key={product.id} product={product} />)}</div>{limit < filtered.length && <div className="load-more"><button className="button button-outline" onClick={() => setLimit(limit + 12)}>More delicious things<ArrowDown size={18} /></button><p>Showing {Math.min(limit, filtered.length)} of {filtered.length} items</p></div>}</> : <div className="empty-search"><Search size={38} /><h3>No bites found just yet.</h3><p>Try a different search or explore another category.</p><button className="button button-yellow" onClick={() => setParams({})}>See the whole menu</button></div>}
      <p className="menu-disclaimer">Prices follow the supplied Caf&eacute; 007 menu. Food photography is illustrative. Pizza deals include regular pizzas only.</p>
    </div></section>
  </>;
}