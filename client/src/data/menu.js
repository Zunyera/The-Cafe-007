import { images } from './images.js';
export { images };

export const categories = ['Burgers', 'Wraps', 'Snacks', 'Beverages', 'Regular Pizza', 'Pizza Treat', 'Café Special', 'Pizza Deals', 'Deals', 'New Additions', 'Pasta', 'Extras'];
export const sizeOrder = ['Small', 'Medium', 'Large'];
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function item(name, price, category, image, description, extra = {}) {
  return { id: slug(name), name, price, category, image, description, ...extra };
}

const burgers = [
  ['Zinger', 350, 'Our crispy chicken classic.'],
  ['Fillet Burger', 400, 'A chicken fillet favourite.'],
  ['Zinger Tower', 500, 'Crispy chicken, next level.'],
  ['Mighty Zinger', 550, 'A mighty zinger.'],
  ['Patty', 270, 'Classic patty burger.'],
  ['Chaply Patty', 270, 'Chaply patty burger.'],
  ['B.B.Q Patty Tower', 420, 'BBQ patty tower.'],
  ['Pizza Burger', 400, 'Two favourites in one.'],
  ['Jalapeno Burger', 380, 'A little jalapeno kick.'],
  ['Grilled Burger', 450, 'Grilled burger.'],
].map(([name, price, description]) => item(name, price, 'Burgers', images.burger, description));
burgers.push(item('Burger', 320, 'Burgers', images.burger, 'Your burger, your flavour.', { flavours: ['Tikka', 'Fajita', 'Mughlai', 'Achari'] }));

const wraps = [
  ['Shawarma', 300], ['Cheese Shawarma', 350], ['Zinger Shawarma', 350], ['Pocket Shawarma', 350],
  ['Paratha Roll', 320], ['Cheese Paratha Roll', 350], ['Kebab Paratha Roll', 300], ['Special Paratha Roll', 400],
  ['Zinger Pratha Roll', 350], ['Behari Roll', 700], ['Platter', 600], ['Paratha', 300],
  ['Zingeratha', 600], ['Tortilla', 600], ['Fillet Wrap', 650], ['Kebab Bites', 700],
].map(([name, price]) => item(name, price, 'Wraps', images.wrap, 'Big flavour, wrapped up.',
  name === 'Paratha' ? { flavours: ['Chapli', 'BBQ Tikka', 'Garlic', 'Mughlai'] }
    : name === 'Tortilla' ? { flavours: ['Mughlai', 'Tikka', 'Fajita', 'Kebab', 'Malai'] } : {}));

const snacks = [
  ['Fries', 300, images.fries], ['Family Fries', 450, images.fries], ['Garlic Fries', 450, images.fries],
  ['Loaded Fries / Pizza Fries', 800, images.fries], ['5 Wings / 5 Nuggets', 280, images.chicken],
  ['10 Wings', 500, images.chicken], ['10 Nuggets', 500, images.chicken], ['Club Sandwich', 450, images.sandwich],
  ['5 Garlic Mayo Wings / Grilled Wings', 300, images.chicken], ['10 Garlic Mayo Wings / Grilled Wings', 560, images.chicken],
  ['Pizza Paratha', 620, images.wrap], ['Pizza Shawarma', 620, images.wrap], ['Pizza Sandwich', 550, images.wrap], ['Doner', 750, images.wrap],
].map(([name, price, image]) => item(name, price, 'Snacks', image, 'A little extra on the side.',
  ['Pizza Paratha', 'Pizza Shawarma', 'Pizza Sandwich'].includes(name) ? { flavours: ['Tikka', 'Fajita', 'Mughlai', 'Achari'] }
    : name === '5 Wings / 5 Nuggets' ? { flavours: ['5 Wings', '5 Nuggets'] }
    : name.includes('Garlic Mayo') ? { flavours: ['Garlic Mayo Wings', 'Grilled Wings'] }
    : name === 'Loaded Fries / Pizza Fries' ? { flavours: ['Loaded Fries', 'Pizza Fries'] } : {}));

const beverages = [
  ['Regular Drink', 70], ['500ml Drink', 130], ['1 Liter Drink', 190], ['1.5 Liter Drink', 240],
  ['M - Water 500ml', 70], ['M - Water 1.5 Liter', 130],
].map(([name, price]) => item(name, price, 'Beverages', name.includes('Water') ? images.water : images.drink,
  name.includes('Water') ? 'Mineral water.' : 'A cold drink.', { tags: ['drinks'] }));

const pizzaGroups = [
  { category: 'Regular Pizza', names: ['Chicken Tikka', 'Chicken Fajita', 'Fajita Sicilian', 'Hot & Spicy', 'Chicken Achari', 'Chicken Tandoori', 'Veggie Lover', 'Cheese Lover'], sizes: { Small: 620, Medium: 980, Large: 1350 } },
  { category: 'Pizza Treat', names: ['Bonefire Pizza', 'Super Supreme', 'Chicken Kebab', 'Creamy Pizza', 'Pepperoni Pizza', 'Extreme Pizza', 'Garlic Pizza', 'Chapli Pizza'], sizes: { Small: 680, Medium: 1180, Large: 1550 } },
  { category: 'Café Special', names: ['Shahi Crust', 'Nawabi Crust', 'Royal Crust', 'Kabah Crust', 'Pluff & Crust', 'Kebabish Crust', 'Behari Kabab', 'Mughlai Pizza', '2x Pizza', 'Malai Boti Pizza', 'Lazania Pizza', 'Steak Pizza'], sizes: { Small: 800, Medium: 1300, Large: 1800 } },
];
const pizzas = pizzaGroups.flatMap((group) =>
  group.names.map((name) =>
    item(name, group.sizes.Small, group.category, images.pizza, 'Pick your pizza size.', { sizes: group.sizes, tags: ['pizza'] })
  )
);

const dealRows = [
  { contents: ['1 Zinger Burger', '1 Regular Drink'], price: 400 },
  { contents: ['1 Patty Burger', '1 Regular Drink'], price: 320 },
  { contents: ['1 Zinger Burger', '1 Regular Fries', '1 Regular Drink'], price: 600 },
  { contents: ['1 Filled Burger', '1 Regular Drink'], price: 450 },
  { contents: ['1 Zinger Tower', '1 Regular Fries', '1 Regular Drink'], price: 700 },
  { contents: ['1 Pizza Fries', '1 Regular Drink'], price: 850, image: images.fries },
  { contents: ['5 Hot Wings', '1 Regular Drink'], price: 330, image: images.chicken },
  { contents: ['10 Hot Wings', '1 Regular Drink'], price: 550, image: images.chicken },
  { contents: ['1 Zinger Burger', '5 Hot Wings', '1 Regular Fries', '500ml Drink'], price: 850 },
  { contents: ['1 Cheese Sticks', '1 Regular Drink'], price: 700, image: images.pizza },
  { contents: ['2 Zinger Burgers', '1 Regular Fries', '500ml Drink'], price: 950 },
  { contents: ['5 Zinger Burgers', '1 Family Fries', '1.5 Liter Drink'], price: 2300 },
  { contents: ['1 Special Might Zinger Burger', '1 Regular Fries', '1 Regular Drink'], price: 800 },
  { contents: ['1 Club Sandwich', '1 Regular Fries', '1 Regular Drink'], price: 650, image: images.sandwich },
  { contents: ['1 Mughlai / Tikka Burger', '1 Regular Fries', '1 Regular Drink'], price: 550 },
  { contents: ['1 Doner', '500ml Drink'], price: 830, image: images.wrap },
  { contents: ['5 Paratha Rolls', '1 Liter Drink'], price: 1650, image: images.wrap },
  { contents: ['5 Shawarmas', '1 Liter Drink'], price: 1550, image: images.wrap },
  { contents: ['10 Chicken Nuggets', '1 Regular Drink'], price: 550, image: images.chicken },
  { contents: ['2 Zinger Burgers', '5 Hot Wings', '1 Regular Fries', '500ml Drink'], price: 1200 },
  { contents: ['1 Chapli Burger', '1 Regular Drink'], price: 320 },
  { contents: ['1 BBQ Patty Tower Burger', '1 Regular Drink'], price: 460 },
  { contents: ['1 Jalapeno Burger', '1 Regular Drink'], price: 420 },
  { contents: ['1 Grilled Zinger', '1 Regular Drink'], price: 480 },
  { contents: ['3 Zinger Burgers', '1 Liter Drink'], price: 1150 },
  { contents: ['1 Zinger Burger', '1 Paratha Roll', '500ml Drink'], price: 750 },
];
const deals = dealRows.map((deal, index) =>
  item(index === 11 ? 'Family Deal' : `Deal ${index + 1}`, deal.price, 'Deals', deal.image || images.deal, deal.contents.join(' + '), {
    id: `deal-${index + 1}`,
    contents: deal.contents,
    dealNumber: index + 1,
    tags: ['combo', ...deal.contents],
    ...(index === 14 ? { flavours: ['Mughlai', 'Tikka'] } : {}),
  })
);

const pizzaDealRows = [
  { contents: ['2 Small Pizzas', '500ml Drink'], price: 1300 },
  { contents: ['2 Medium Pizzas', '1 Liter Drink'], price: 2000 },
  { contents: ['1 Large Pizza', '1 Medium Pizza', '1.5 Liter Drink'], price: 2400 },
  { contents: ['1 Large Pizza', '10 Hot Wings', '1.5 Liter Drink'], price: 1950 },
  { contents: ['1 Medium Pizza', '10 Hot Wings', '1 Liter Drink'], price: 1550 },
  { contents: ['1 Small Pizza', '5 Hot Wings', '500ml Drink'], price: 950 },
  { contents: ['1 Medium Pizza', '1 Small Pizza', '1 Liter Drink'], price: 1650 },
  { contents: ['2 Large Pizzas', '1.5 Liter Drink'], price: 2750 },
  { contents: ['2 Large Pizzas', '2 Zinger Burgers', '20 Hot Wings', '1 Family Fries', '2 x 1.5 Liter Drinks'], price: 5700 },
  { contents: ['3 Large Pizzas', '3 Medium Pizzas', '2 Family Fries', '2 x 1.5 Liter Drinks'], price: 8000 },
];
const pizzaDeals = pizzaDealRows.map((deal, index) =>
  item(`Big Deal ${index + 1}`, deal.price, 'Pizza Deals', images.pizza, deal.contents.join(' + '), {
    id: `big-deal-${index + 1}`,
    contents: deal.contents,
    dealNumber: index + 1,
    flavours: pizzaGroups[0].names,
    tags: ['pizza', 'combo', ...deal.contents],
  })
);

const additions = [
  item('Half Broast', 750, 'New Additions', images.chicken, 'Leg & breast / thigh & wing.', { flavours: ['Leg & breast', 'Thigh & wing'] }),
  item('Full Broast', 1400, 'New Additions', images.chicken, '1 leg, 1 breast, 1 thigh, 1 wing.'),
];
const pasta = [
  item('Flaming Pasta', 450, 'Pasta', images.pasta, 'Half or full.', { variants: [{ label: 'Half', price: 450 }, { label: 'Full', price: 800 }] }),
  item('Creamy Pasta', 450, 'Pasta', images.pasta, 'Half or full.', { variants: [{ label: 'Half', price: 450 }, { label: 'Full', price: 800 }] }),
  item('Fettuccine Alfredo Pasta', 900, 'Pasta', images.pasta, 'Fettuccine Alfredo.'),
];
const extras = [
  ...['Dip Sauce', 'Garlic Sauce', 'Mustard Sauce', 'Cheese Slice'].map((name) => item(name, 70, 'Extras', images.fries, 'A little extra.')),
  item('Extra Topping', 100, 'Extras', images.pizza, 'Match pizza size.', { variants: [{ label: 'Small', price: 100 }, { label: 'Medium', price: 150 }, { label: 'Large', price: 200 }] }),
];

export const products = [...burgers, ...pizzas, ...wraps, ...snacks, ...beverages, ...deals, ...pizzaDeals, ...additions, ...pasta, ...extras];
export const productById = new Map(products.map((p) => [p.id, p]));
export const popularProducts = ['zinger', 'chicken-fajita', 'cheese-shawarma', 'loaded-fries-pizza-fries'].map((id) => productById.get(id));
export const featuredDeals = ['deal-3', 'big-deal-2', 'deal-12'].map((id) => productById.get(id));
export const categoryTiles = [
  { name: 'Burgers', image: images.burger, filter: 'Burgers' },
  { name: 'Pizza', image: images.pizza, filter: 'Pizza' },
  { name: 'Wraps', image: images.wrap, filter: 'Wraps' },
  { name: 'Snacks', image: images.fries, filter: 'Snacks' },
  { name: 'Beverages', image: images.drink, filter: 'Beverages' },
  { name: 'Deals', image: images.deal, filter: 'Deals' },
];

export function getVariants(product) {
  return product.sizes ? sizeOrder.map((label) => ({ label, price: product.sizes[label] })) : product.variants || [];
}
export function getPrice(product, variant) {
  return getVariants(product).find((o) => o.label === variant)?.price ?? product.price;
}
export function getDefaultVariant(product) {
  return getVariants(product)[0]?.label || '';
}
export function matchesCategory(product, category) {
  if (!category || category === 'All') return true;
  if (category === 'Pizza') return Boolean(product.sizes);
  if (category === 'Deals') return product.category === 'Deals' || product.category === 'Pizza Deals';
  return product.category === category || product.tags?.includes(category.toLowerCase());
}
export function searchProducts(query, category = 'All') {
  const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.']/g, '').toLowerCase();
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  return products.filter(
    (product) =>
      matchesCategory(product, category) &&
      words.every((word) =>
        normalize([product.name, product.category, product.description, ...(product.tags || []), ...(product.flavours || [])].join(' ')).includes(word)
      )
  );
}