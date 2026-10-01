import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDefaultVariant, getPrice, getVariants, productById } from '../data/menu.js';
import { readLocal, writeLocal } from '../utils/format.js';

const CartContext = createContext(null);

function restoreCart() {
  const saved = readLocal('cafe007.cart', []);
  if (!Array.isArray(saved)) return [];
  return saved.filter((entry) => {
    if (!entry || typeof entry.productId !== 'string' || typeof entry.key !== 'string') return false;
    const product = productById.get(entry.productId);
    if (!product || !Number.isInteger(entry.quantity) || entry.quantity < 1) return false;
    const variants = getVariants(product);
    return variants.length ? variants.some((v) => v.label === entry.variant) : entry.variant === '';
  });
}

export function CartProvider({ children }) {
  const [entries, setEntries] = useState(restoreCart);
  const navigate = useNavigate();

  useEffect(() => {
    writeLocal('cafe007.cart', entries);
  }, [entries]);

  const lines = useMemo(
    () =>
      entries.flatMap((entry) => {
        const product = productById.get(entry.productId);
        if (!product) return [];
        const unitPrice = getPrice(product, entry.variant);
        return [{ ...entry, product, unitPrice, subtotal: unitPrice * entry.quantity }];
      }),
    [entries]
  );

  function addItem(product, quantity = 1, variant = getDefaultVariant(product), flavour = product.flavours?.[0] || '') {
    const key = JSON.stringify([product.id, variant, flavour]);
    const qty = Math.max(1, Math.min(99, Math.floor(quantity)));
    setEntries((previous) => {
      const existing = previous.find((entry) => entry.key === key);
      return existing
        ? previous.map((entry) => (entry.key === key ? { ...entry, quantity: Math.min(99, entry.quantity + qty) } : entry))
        : [...previous, { key, productId: product.id, quantity: qty, variant, flavour }];
    });
    navigate('/cart', { state: { added: product.name } });
  }

  return (
    <CartContext.Provider
      value={{
        lines,
        count: lines.reduce((sum, line) => sum + line.quantity, 0),
        subtotal: lines.reduce((sum, line) => sum + line.subtotal, 0),
        addItem,
        setQuantity: (key, quantity) =>
          setEntries((previous) =>
            previous.map((entry) =>
              entry.key === key ? { ...entry, quantity: Math.max(1, Math.min(99, Math.floor(quantity))) } : entry
            )
          ),
        removeItem: (key) => setEntries((previous) => previous.filter((entry) => entry.key !== key)),
        clearCart: () => setEntries([]),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('CartProvider is required.');
  return context;
}