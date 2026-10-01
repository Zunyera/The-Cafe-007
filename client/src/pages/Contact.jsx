import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Info, MapPin, Phone, Truck } from 'lucide-react';
import { restaurant } from '../data/restaurant.js';
import { telephone, validPhone, writeLocal } from '../utils/format.js';
import { submitContact } from '../services/api.js';
import { Field, PageHeading, SocialIcon } from '../components/ui.jsx';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get('phone') || '').trim();
    if (phone && !validPhone(phone)) { setError('Please enter a valid phone number or leave it empty.'); return; }
    if (String(data.get('name')).trim().length < 2 || String(data.get('message')).trim().length < 10) { setError('Please enter your name and a message of at least 10 characters.'); return; }
    const savedMessage = { ...Object.fromEntries(data), createdAt: new Date().toISOString() };
    writeLocal('cafe007.contact', savedMessage);
    submitContact(savedMessage).catch(() => {});
    setSubmitted(true);
    setError('');
  }

  return (
    <>
      <PageHeading eyebrow="Get in touch" title="Let's talk food. Or just say hello." description="A question, a craving, or a special occasion? We'd love to hear from you." />
      <section className="section">
        <div className="container contact-layout">
          <div className="contact-info">
            <p className="eyebrow">Your Mailsi hangout</p>
            <h2>Good conversations<br />start here.</h2>
            <div className="contact-block">
              <Phone size={23} />
              <div><h3>Give us a call</h3>{restaurant.phones.map(phone => <a key={phone} href={telephone(phone)}>{phone}</a>)}</div>
            </div>
            <div className="contact-block">
              <MapPin size={24} />
              <div>
                <h3>Come say hello</h3>
                <p>{restaurant.address}</p>
                <a className="text-link" href={restaurant.directions} target="_blank" rel="noreferrer">Get directions<ArrowUpRight size={16} /></a>
              </div>
            </div>
            <div className="contact-block">
              <Truck size={24} />
              <div>
                <h3>We'll bring the good food</h3>
                <p>{restaurant.delivery}.</p>
                <p className="small-text">Call to confirm delivery coverage and opening hours.</p>
              </div>
            </div>
            <div className="contact-socials">
              <p>Keep up with the hangout</p>
              <a href={restaurant.facebook} target="_blank" rel="noreferrer"><SocialIcon kind="facebook" />Cafe007Mailsi<ArrowUpRight size={15} /></a>
              <a href={restaurant.instagram} target="_blank" rel="noreferrer"><SocialIcon kind="instagram" />@cafe007.mailsi<ArrowUpRight size={15} /></a>
            </div>
          </div>

          <div className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success">
                <span className="success-icon"><Check size={29} /></span>
                <h2>Thanks for your message.</h2>
                <p>We've received it and will get back to you as soon as we can.</p>
                <p>Need a quick answer? Call one of our official numbers.</p>
                <a className="button button-dark" href={telephone(restaurant.phones[0])}><Phone size={17} />Call {restaurant.phones[0]}</a>
                <button className="text-link" onClick={() => setSubmitted(false)}>Write another message<ArrowRight size={16} /></button>
              </div>
            ) : (
              <>
                <h2>Send us a message</h2>
                <p className="form-intro">Tell us what's on your mind. We read every message.</p>
                <form className="stack-form" onSubmit={submit}>
                  <div className="form-grid">
                    <Field label="Full name" name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Your full name" />
                    <Field label="Email address" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
                    <Field label="Phone number (optional)" name="phone" type="tel" maxLength={20} autoComplete="tel" placeholder="03XX-XXXXXXX" />
                    <div className="field">
                      <label htmlFor="contact-subject">Subject</label>
                      <select id="contact-subject" name="subject" defaultValue="General enquiry">
                        <option>General enquiry</option>
                        <option>Order question</option>
                        <option>Reservation</option>
                        <option>Feedback</option>
                        <option>Something else</option>
                      </select>
                    </div>
                    <div className="field span-two">
                      <label htmlFor="contact-message">Your message <span className="required-mark">*</span></label>
                      <textarea id="contact-message" name="message" rows={5} required minLength={10} maxLength={2000} placeholder="How can we help?" />
                    </div>
                  </div>
                  {error && <p className="form-error" role="alert">{error}</p>}
                  <button type="submit" className="button button-dark full-width">Send message<ArrowRight size={18} /></button>
                  <p className="form-footnote"><Info size={15} />For urgent orders, please call the restaurant directly.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}