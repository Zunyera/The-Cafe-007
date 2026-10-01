import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, ChevronRight, Minus, Plus, X } from 'lucide-react';

// Café 007 logo drawn in code (agent silhouette + CAFÉ 007 + Let's Hangout...) so no image file is needed.
export function Logo({ className = '' }) {
  return (
    <svg className={`brand-logo ${className}`} viewBox="0 0 270 190" role="img" aria-label="CAFÉ 007. Let's Hangout...">
      <path fill="#f5be16" d="M84 31 191 4 177 20 208 13 196 28 215 25 183 43 209 39 194 56 214 52 194 69 204 73 183 88 188 99 154 110 91 111 99 97 66 101 88 81 65 84 84 66 63 66 91 46 70 49Z" />
      <g fill="#171717">
        <path d="m113 44 7-30 17-4 21 5 10 31-28 7Z" />
        <path d="m92 46 17-4 27 4 37-2 16 4-15 10-70-1Z" />
        <path d="m116 60 42-1-4 24-17 18-16-18Z" />
        <path d="m105 79 19 7 13 21 14-19 14-8 16 18-22 15-5 11h-36l-4-11-22-12Z" />
      </g>
      <path fill="#fff" d="m125 18 11-3 3 2-2 10-6 2-5-2 1-3 6-1 1-4-4 1-1 3-4 1Z" />
      <path fill="#f5be16" d="m115 36 47 1 2 6-50-1Z" />
      <path fill="#fff" d="m117 61 16 3-9 4 6 6-5 6-6-8Zm28 2 12-2-4 11-9 7 2-9-7-2Zm-22 25 14 14 15-15-14 26Z" />
      <path fill="#f5be16" d="M5 117h260v58H5Z" />
      <path fill="#fff" d="M11 123h98v46H11Z" />
      <path fill="#171717" d="M109 123h150v46H109Z" />
      <text x="18" y="158" fill="#171717" fontFamily="Arial,Helvetica,sans-serif" fontSize="33" fontWeight="800" letterSpacing="2">CAFÉ</text>
      <text x="114" y="165" fill="#f5c400" fontFamily="Arial,Helvetica,sans-serif" fontSize="54" fontWeight="900" letterSpacing="1">007</text>
      <path fill="#171717" d="M65 175h145v15H65Z" />
      <text x="137" y="186" fill="#fff" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontSize="10" fontWeight="600" letterSpacing="1.4">Let's Hangout...</text>
    </svg>
  );
}

export function SocialIcon({ kind }) {
  return kind === 'facebook'
    ? <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.2c-.3 0-1.3-.2-2.5-.2-2.4 0-4.1 1.5-4.1 4.2v2.4H7.5v3.2h2.7V21z" /></svg>
    : <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></svg>;
}

export function FoodImage({ src, alt, className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed ? 'https://images.pexels.com/photos/7497299/pexels-photo-7497299.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200' : src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => { if (!failed) setFailed(true); }} />;
}

export function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.55, delay }}>{children}</motion.div>;
}

export function PageHeading({ eyebrow, title, description, children }) {
  return <section className="page-heading"><div className="container"><div className="breadcrumb"><Link to="/">Home</Link><ChevronRight size={13} /><span>{eyebrow}</span></div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}{children}</div></section>;
}

export function SectionHeading({ eyebrow, title, description, link, linkText = 'Explore more' }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{link && <Link className="text-link" to={link}>{linkText}<ArrowRight size={17} /></Link>}</div>;
}

export function Quantity({ value, onChange, label = 'Quantity' }) {
  return <div className="quantity" role="group" aria-label={label}><button type="button" aria-label={`Decrease ${label.toLowerCase()}`} disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus size={16} /></button><span aria-live="polite">{value}</span><button type="button" aria-label={`Increase ${label.toLowerCase()}`} disabled={value >= 99} onClick={() => onChange(value + 1)}><Plus size={16} /></button></div>;
}

export function Field({ label, error, className = '', ...props }) {
  const id = props.id || props.name || label.toLowerCase().replace(/\s+/g, '-');
  return <div className={`field ${className}`}><label htmlFor={id}>{label}{props.required && <span className="required-mark"> *</span>}</label><input {...props} id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />{error && <span className="field-error" id={`${id}-error`}>{error}</span>}</div>;
}

export function SuccessState({ title, children, link = '/menu', linkText = 'Explore the menu' }) {
  return <div className="success-state"><div className="success-icon"><Check size={30} strokeWidth={2.5} /></div><p className="eyebrow">All set</p><h2>{title}</h2><div className="success-copy">{children}</div><Link className="button button-dark" to={link}>{linkText}<ArrowRight size={17} /></Link></div>;
}

export function Modal({ open, onClose, title, children, className = '' }) {
  const panel = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      const first = panel.current?.querySelector('[data-autofocus]') || panel.current?.querySelector('input, button, a');
      first?.focus();
    }, 70);
    function keydown(event) {
      if (event.key === 'Escape') closeRef.current();
      if (event.key !== 'Tab') return;
      const elements = panel.current?.querySelectorAll('button:not([disabled]), a[href], input, select, textarea, [tabindex="0"]');
      if (!elements?.length) return;
      const first = elements[0]; const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', keydown);
    return () => { clearTimeout(timer); document.body.style.overflow = oldOverflow; document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, [open]);
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><motion.div ref={panel} role="dialog" aria-modal="true" aria-label={title} className={`modal-panel ${className}`} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }}><button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={22} /></button>{children}</motion.div></motion.div>}</AnimatePresence>;
}