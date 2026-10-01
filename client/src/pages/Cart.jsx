import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../utils/format.js';
import { FoodImage, PageHeading, Quantity } from '../components/ui.jsx';
import OrderSummary from '../components/OrderSummary.jsx';

export default function Cart() {
  const { lines, setQuantity, removeItem, count } = useCart();
  const { state } = useLocation();

  return <>
    <PageHeading eyebrow="Your cart" title="A little closer to delicious." description="Your favourites are all here. Make it a meal to remember." />
    <section className="section"><div className="container">
      {lines.length ? (
        <div className="cart-layout">
          <div>
            {state?.added && <div className="inline-success" role="status"><Check size={18} />{state.added} added to your cart.</div>}
            <div className="cart-list-heading"><h2>Your order <span>({count})</span></h2><Link className="text-link" to="/menu">Add more<ArrowRight size={16} /></Link></div>
            <div className="cart-items">
              {lines.map(line => (
                <article className="cart-item" key={line.key}>
                  <Link className="cart-item-image" to={`/food/${line.productId}`}><FoodImage src={line.product.image} alt={line.product.name} /></Link>
                  <div className="cart-item-info">
                    <p className="food-category">{line.product.category}</p>
                    <Link to={`/food/${line.productId}`} className="cart-item-name">{line.product.name}</Link>
                    {(line.variant || line.flavour) && <p className="cart-variant">{[line.variant, line.flavour].filter(Boolean).join(' / ')}</p>}
                    <span className="cart-unit-price">{money(line.unitPrice)} each</span>
                  </div>
                  <Quantity value={line.quantity} onChange={value => setQuantity(line.key, value)} label={`${line.product.name} quantity`} />
                  <div className="cart-item-end">
                    <strong>{money(line.subtotal)}</strong>
                    <button className="remove-button" onClick={() => removeItem(line.key)} aria-label={`Remove ${line.product.name}`}><Trash2 size={15} /><span>Remove</span></button>
                  </div>
                </article>
              ))}
            </div>
            <Link className="text-link continue-link" to="/menu"><ArrowLeft size={17} />Continue shopping</Link>
          </div>
          <OrderSummary>
            <Link className="button button-dark full-width" to="/checkout">Proceed to checkout<ArrowRight size={18} /></Link>
            <p className="summary-bottom-note">Good food is just around the corner.</p>
          </OrderSummary>
        </div>
      ) : (
        <div className="empty-page">
          <div className="empty-illustration"><ShoppingBag size={49} strokeWidth={1.4} /></div>
          <h2>Your next hangout is waiting.</h2>
          <p>Your cart is empty for now. Add a few favourites and let the good times begin.</p>
          <Link className="button button-dark" to="/menu">Explore the menu<ArrowRight size={18} /></Link>
        </div>
      )}
    </div></section>
  </>;
}