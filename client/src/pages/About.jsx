import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { FoodImage, Reveal, SectionHeading } from '../components/ui.jsx';
import { images } from '../data/menu.js';

export default function About() {
  return (
    <>
      <section className="about-hero">
        <img src={images.hangout} alt="The joy of sharing good food with good company" />
        <div className="about-hero-shade" />
        <div className="container">
          <p className="eyebrow">Good food. Great company.</p>
          <h1>CAF&Eacute; 007</h1>
          <h2>Let's Hangout...</h2>
          <p>Some of the best moments happen<br />around a table. Make this one yours.</p>
          <Link className="button button-dark" to="/reservation">Save your seat<ArrowUpRight size={18} /></Link>
        </div>
      </section>

      <section className="section">
        <div className="container about-story">
          <Reveal>
            <p className="eyebrow">A little about us</p>
            <h2>Made for cravings.<br />Meant for company.</h2>
          </Reveal>
          <Reveal>
            <p>Caf&eacute; 007 is a place for your favourite food and your favourite people. A quick shawarma on a busy day. A crispy burger for a well-earned break. A pizza in the middle of the table, with everyone reaching for a slice.</p>
            <p>Our menu brings burgers, wraps, snacks, pasta, and three delicious pizza ranges together with deals made for sharing. Whether it's a solo food run or a get-together with the whole crew, there's a hangout for that.</p>
            <Link className="text-link" to="/menu">Get to know the menu<ArrowRight size={17} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section about-values">
        <div className="container">
          <SectionHeading eyebrow="The Café 007 way" title="Quality is our recipe." description="Good food, generous choices, and a reason to come together." />
          <div className="values-grid">
            <Reveal>
              <span>01 / THE FOOD</span>
              <h3>Something for every craving.</h3>
              <p>From classic Chicken Tikka pizza to our Caf&eacute; Special range, crispy zingers, and creamy pasta. Find your favourite and make it your own.</p>
            </Reveal>
            <Reveal delay={0.07}>
              <span>02 / THE VALUE</span>
              <h3>Good times, shared.</h3>
              <p>Regular deals, pizza bundles, and our Family Deal bring more of the things you love to the table.</p>
            </Reveal>
            <Reveal delay={0.14}>
              <span>03 / THE HANGOUT</span>
              <h3>Your people. Your place.</h3>
              <p>A welcoming spot in Mailsi and beyond, with free delivery on orders over Rs. 500 when you'd rather stay in.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-menu-grid">
          <Reveal className="about-food-image"><FoodImage src={images.pizza} alt="A freshly baked Café 007 pizza" /></Reveal>
          <Reveal>
            <p className="eyebrow">Hungry yet?</p>
            <h2>Come for the food.<br />Stay for the hangout.</h2>
            <p>Browse the full menu, pick your favourites, and let us take care of the rest. Good food is always a good idea.</p>
            <Link className="button button-yellow" to="/menu">Explore the menu<ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}