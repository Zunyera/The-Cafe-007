import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { getDefaultVariant } from '../data/menu.js';
import { money } from '../utils/format.js';
import { FoodImage } from './ui.jsx';

export default function FoodCard({ product, onAdd }) {
  const { addItem } = useCart();
  const variant = getDefaultVariant(product);
  return <article className="food-card">
    <Link to={`/food/${product.id}`} className="food-card-image" aria-label={`View ${product.name}`} onClick={onAdd}>
      <FoodImage src={product.image} alt={product.name} />
      {product.category === 'Deals' && <span className="food-badge">{product.dealNumber === 12 ? 'Family favourite' : `Deal ${product.dealNumber}`}</span>}
      {product.category === 'Pizza Deals' && <span className="food-badge red-badge">Pizza deal</span>}
      <span className="food-image-arrow"><ArrowUpRight size={19} /></span>
    </Link>
    <div className="food-card-content"><p className="food-category">{product.category}</p><Link className="food-name" to={`/food/${product.id}`} onClick={onAdd}>{product.name}</Link><p className="food-description">{product.description}</p>
      <div className="food-card-bottom"><div className="food-price">{variant && <small>{variant}</small>}<strong>{money(product.price)}</strong></div><button className="add-button" onClick={() => { addItem(product); onAdd?.(); }} aria-label={`Add ${variant ? `${variant.toLowerCase()} ` : ''}${product.name} to cart`}><Plus size={15} /><span>Add to cart</span></button></div>
    </div>
  </article>;
}