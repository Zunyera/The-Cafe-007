import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MapPin, Phone, Truck } from 'lucide-react';
import { categoryTiles, featuredDeals, images, popularProducts } from '../data/menu.js';
import { branches, restaurant } from '../data/restaurant.js';
import { telephone } from '../utils/format.js';
import FoodCard from '../components/FoodCard.jsx';
import BranchCard from '../components/BranchCard.jsx';
import { FoodImage, Reveal, SectionHeading } from '../components/ui.jsx';

export default function Home() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  return <>
    <section className="hero">
      <motion.img className="hero-image" src={images.hero} alt="Crispy zinger burger, golden fries, and a freshly baked pizza" fetchPriority="high" initial={reduced ? false : { scale: 1.045 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }} />
      <div className="hero-shade" />
      <div className="container hero-container"><motion.div className="hero-copy" initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }}>
        <p className="hero-eyebrow">QUALITY IS OUR RECIPE</p>
        <h1>CAF&Eacute; <span>007</span><span className="hero-brand-dot">.</span></h1>
        <h2>Big flavours.<br />Better <span className="hero-underline">hangouts.<svg viewBox="0 0 310 16" fill="none" aria-hidden="true"><path d="M3 10C72 1 217 2 305 8M70 14c65-6 145-5 201-4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" /></svg></span></h2>
        <p className="hero-description">Your favourite bites. Your favourite people.<br />Good times are always on the menu.</p>
        <div className="hero-buttons"><Link to="/menu" className="button button-dark">Order now<ArrowUpRight size={19} /></Link><Link to="/menu" className="button button-outline">View menu<ArrowRight size={18} /></Link></div>
        <Link className="hero-branch-link" to="/branches"><MapPin size={15} />Find your nearest hangout<ArrowRight size={15} /></Link>
      </motion.div></div>
    </section>

    <section className="section categories-section"><div className="container"><Reveal><SectionHeading eyebrow="Follow your cravings" title="What are you in the mood for?" description="A little crispy. A little cheesy. A whole lot of delicious." link="/menu" linkText="Explore the menu" /></Reveal><div className="category-grid">{categoryTiles.map((category, index) => <Reveal key={category.name} delay={index * 0.045}><Link to={`/menu?category=${encodeURIComponent(category.filter)}`} className="category-card"><div className="category-image"><FoodImage src={category.image} alt={category.name} /></div><div className="category-label"><h3>{category.name}</h3><ArrowUpRight size={17} /></div></Link></Reveal>)}</div></div></section>

    <section className="section popular-section"><div className="container"><Reveal><SectionHeading eyebrow="The good stuff" title="Big on flavour. Easy to love." description="Meet a few favourites from the Café 007 menu." link="/menu" linkText="View full menu" /></Reveal><div className="food-grid">{popularProducts.map((product, index) => <Reveal key={product.id} delay={index * 0.055}><FoodCard product={product} /></Reveal>)}</div></div></section>

    <section className="section deals-section"><div className="container"><Reveal><SectionHeading eyebrow="Good food, great value" title="More bites. More good times." description="For solo cravings, catch-ups, and the whole crew." link="/deals" linkText="Discover all deals" /></Reveal><div className="food-grid deals-grid">{featuredDeals.map((product, index) => <Reveal key={product.id} delay={index * 0.07}><FoodCard product={product} /></Reveal>)}</div><p className="section-footnote">Pizza deals include regular pizzas only. There is something for every kind of hangout.</p></div></section>

    <section className="section"><div className="container"><Reveal><SectionHeading eyebrow="A little closer to you" title="Find your favourite spot." description="Come hungry. Bring your people. We'll bring the good food." link="/branches" linkText="See all branches" /></Reveal><div className="branch-grid">{branches.slice(0, 3).map(branch => <Reveal key={branch.id}><BranchCard branch={branch} onView={selected => navigate(`/branches?branch=${selected.id}`)} /></Reveal>)}</div></div></section>

    <section className="section story-section"><div className="container story-grid"><Reveal className="story-image"><FoodImage src={images.hangout} alt="Friends sharing burgers and pizza over a relaxed café meal" /></Reveal><Reveal className="story-copy"><p className="eyebrow">More than a meal</p><h2>Good food brings<br />good people together.</h2><p>That's the spirit of Caf&eacute; 007. From your first bite of a crispy zinger to the last slice of pizza, we're all about food worth sharing and moments worth making.</p><p className="story-mantra">Your favourites. Your people. Your place.</p><Link to="/about" className="text-link">A little about us<ArrowRight size={18} /></Link><span className="handwritten">Let's Hangout...</span></Reveal></div></section>

    <section className="delivery-section"><div className="container delivery-inner"><div className="delivery-icon"><Truck size={39} strokeWidth={1.5} /></div><div><p className="eyebrow">Great food. Right to your door.</p><h2>Your cravings, delivered.</h2><p>Free delivery on orders over <strong>Rs. 500.</strong></p></div><div className="delivery-actions"><Link className="button button-dark" to="/menu">Let's order<ArrowUpRight size={19} /></Link><a href={telephone(restaurant.phones[0])}><Phone size={16} />{restaurant.phones[0]}</a></div></div></section>
  </>;
}