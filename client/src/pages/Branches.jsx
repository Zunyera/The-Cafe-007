import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Clock3, MapPin, Phone, Search, Truck } from 'lucide-react';
import { branches, restaurant } from '../data/restaurant.js';
import { telephone } from '../utils/format.js';
import BranchCard from '../components/BranchCard.jsx';
import { Modal, PageHeading } from '../components/ui.jsx';

export default function Branches() {
  const [query, setQuery] = useState('');
  const [params, setParams] = useSearchParams();
  const selected = branches.find(branch => branch.id === params.get('branch'));
  const filtered = branches.filter(branch => `${branch.name} ${branch.menuLabel} ${branch.address || ''}`.toLowerCase().includes(query.toLowerCase().trim()));

  return (
    <>
      <PageHeading eyebrow="Our branches" title="Same good food. Your favourite place." description="Find a Café 007 near you. The next great hangout might be just around the corner." />
      <section className="section">
        <div className="container">
          <div className="branches-toolbar">
            <div><p className="eyebrow">Find your hangout</p><h2>Come on over.</h2></div>
            <div className="search-input">
              <Search size={20} />
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label="Find a branch" placeholder="Search a city or branch..." />
            </div>
          </div>
          <div className="branch-grid">
            {filtered.map(branch => <BranchCard key={branch.id} branch={branch} onView={value => setParams({ branch: value.id })} />)}
          </div>
          {!filtered.length && (
            <div className="empty-search">
              <MapPin size={38} />
              <h3>No branches match that search.</h3>
              <p>Try a city listed on our menu, like Mailsi or Burewala.</p>
              <button className="button button-yellow" onClick={() => setQuery('')}>View all branches</button>
            </div>
          )}
          <p className="menu-disclaimer">Locations are listed as printed on the official menu. Full addresses, individual branch phone numbers, and opening hours are shown only where supplied.</p>
        </div>
      </section>

      <Modal open={Boolean(selected)} onClose={() => setParams({})} title={selected ? `${selected.name} branch` : 'Branch details'} className="branch-modal">
        {selected && (
          <>
            <span className="branch-symbol"><MapPin size={28} /></span>
            <p className="eyebrow">{selected.isMain ? 'Our main branch' : 'Your next hangout'}</p>
            <h2>Caf&eacute; 007, {selected.name}</h2>
            <p className="branch-menu-label">{selected.menuLabel}</p>
            <div className="branch-details">
              <div>
                <MapPin size={21} />
                <div><h3>Find us</h3><p>{selected.address || 'The full street address is not supplied in the menu. Location details are awaiting confirmation.'}</p></div>
              </div>
              <div>
                <Phone size={20} />
                <div>
                  <h3>Give us a call</h3>
                  {selected.phones.length
                    ? selected.phones.map(phone => <a key={phone} href={telephone(phone)}>{phone}</a>)
                    : <p>Branch phone number to be confirmed. Main line: <a href={telephone(restaurant.phones[0])}>{restaurant.phones[0]}</a></p>}
                </div>
              </div>
              <div>
                <Clock3 size={20} />
                <div><h3>Opening hours</h3><p>{selected.hours || 'Opening hours are confirmed by the branch.'}</p></div>
              </div>
              <div>
                <Truck size={20} />
                <div><h3>Delivery</h3><p>{selected.delivery === true ? 'Home delivery available. Free delivery on orders over Rs. 500.' : selected.delivery === false ? 'Collection only at this branch.' : 'Delivery availability is confirmed by the branch.'}</p></div>
              </div>
            </div>
            {selected.address && <a className="button button-yellow" href={restaurant.directions} target="_blank" rel="noreferrer">Get directions<ArrowUpRight size={18} /></a>}
          </>
        )}
      </Modal>
    </>
  );
}