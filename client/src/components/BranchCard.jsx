import { ArrowRight, MapPin, Phone } from 'lucide-react';
import { restaurant } from '../data/restaurant.js';
import { telephone } from '../utils/format.js';

export default function BranchCard({ branch, onView }) {
  return <article className="branch-card"><div className="branch-card-top"><span className="branch-symbol"><MapPin size={24} /></span>{branch.isMain && <span className="small-label">Main branch</span>}{branch.id === 'mailsi' && <span className="small-label">Come hang out</span>}</div><h3>{branch.name}</h3><p className="branch-address">{branch.address || (branch.menuLabel !== branch.name ? branch.menuLabel : 'Listed on our official menu.')} {!branch.address && <span>Full address to be confirmed.</span>}</p>{branch.phones[0] && <a className="branch-phone" href={telephone(branch.phones[0])}><Phone size={15} />{branch.phones[0]}</a>}<div className="branch-card-actions"><button className="text-link" onClick={() => onView(branch)}>View branch<ArrowRight size={16} /></button>{branch.address && <a href={restaurant.directions} className="text-link" target="_blank" rel="noreferrer">Directions<ArrowRight size={16} /></a>}</div></article>;
}