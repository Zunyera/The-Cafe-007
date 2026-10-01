import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronRight, Plus, ShoppingBag, Truck } from 'lucide-react';
import { getDefaultVariant, getPrice, getVariants, productById, products } from '../data/menu.js';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../utils/format.js';
import { FoodImage, Quantity, SectionHeading } from '../components/ui.jsx';
import FoodCard from '../components/FoodCard.jsx';

export default function FoodDetails() {
  const { id } = useParams();
  const product = id ? productById.get(id) : undefined;
  if (!product) return <div className="container empty-page"><ShoppingBag size={44} /><h1>That bite isn't on the menu.</h1><p>Let's find you something delicious instead.</p><Link className="button button-dark" to="/menu">Back to menu<ArrowLeft size={17} /></Link></div>;
  return <ProductDetails key={product.id} product={product} />;
}

function ProductDetails({ product }) {
  const [variant, setVariant] = useState(getDefaultVariant(product));
  const [flavour, setFlavour] = useState(product.flavours?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const price = getPrice(product, variant);
  const variants = getVariants(product);
  const related = products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 4);
  return <div className="container product-page"><div className="breadcrumb"><Link to="/">Home</Link><ChevronRight size={13} /><Link to="/menu">Menu</Link><ChevronRight size={13} /><span>{product.name}</span></div><div className="product-layout">
    <div className="product-visual"><FoodImage src={product.image} alt={product.name} eager /><p>Food photography is for illustration.</p></div>
    <div className="product-info"><Link className="text-link back-link" to={`/menu?category=${encodeURIComponent(product.category)}`}><ArrowLeft size={15} />Back to {product.category.toLowerCase()}</Link><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="product-description">{product.description}</p><p className="product-price" aria-live="polite" aria-atomic="true">{money(price)}{variant && <span>/ {variant.toLowerCase()}</span>}</p>
      {product.contents && <div className="bundle-contents"><h3>The good stuff inside</h3><ul>{product.contents.map(content => <li key={content}><Check size={16} />{content}</li>)}</ul>{product.category === 'Pizza Deals' && <p>Regular pizzas only. The selected flavour applies to all pizzas in this deal.</p>}</div>}
      {variants.length > 0 && <fieldset className="variant-field"><legend>{product.sizes ? 'Choose your pizza size' : 'Choose your portion'}</legend><div className="size-options">{variants.map(option => <button type="button" key={option.label} className={variant === option.label ? 'selected' : ''} aria-pressed={variant === option.label} onClick={() => setVariant(option.label)}><span>{option.label}</span><small>{money(option.price)}</small>{variant === option.label && <Check size={13} />}</button>)}</div></fieldset>}
      {product.flavours && <div className="field"><label htmlFor="flavour">{product.category === 'Pizza Deals' ? 'Choose your regular pizza flavour' : 'Choose your favourite'}</label><select id="flavour" value={flavour} onChange={event => setFlavour(event.target.value)}>{product.flavours.map(option => <option key={option}>{option}</option>)}</select></div>}
      <div className="product-order-actions"><Quantity value={quantity} onChange={setQuantity} /><button className="button button-dark" onClick={() => addItem(product, quantity, variant, flavour)}><Plus size={19} />Add to cart<span>{money(price * quantity)}</span></button></div>
      <div className="product-delivery"><Truck size={21} /><div><strong>Good food, delivered.</strong><p>Free delivery on orders over Rs. 500.</p></div></div><p className="allergy-note">Food allergy or a special request? Please contact the branch before ordering.</p>
    </div>
  </div>{related.length > 0 && <section className="section related-section"><SectionHeading eyebrow="Keep the cravings going" title="You might also love..." link={`/menu?category=${encodeURIComponent(product.category)}`} linkText="Explore more" /><div className="food-grid">{related.map(item => <FoodCard product={item} key={item.id} />)}</div></section>}</div>;
}