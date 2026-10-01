const P = 'https://images.pexels.com/photos/';
const Q = '?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';
const IMG = {
  burger: `${P}5474836/pexels-photo-5474836.jpeg${Q}`,
  pizza: `${P}26575528/pexels-photo-26575528.jpeg${Q}`,
  wrap: `${P}5779364/pexels-photo-5779364.jpeg${Q}`,
  fries: `${P}6941027/pexels-photo-6941027.jpeg${Q}`,
  drink: `${P}4113686/pexels-photo-4113686.jpeg${Q}`,
  deal: `${P}11299742/pexels-photo-11299742.jpeg${Q}`,
  pasta: `${P}1438672/pexels-photo-1438672.jpeg${Q}`,
  chicken: `${P}5652256/pexels-photo-5652256.jpeg${Q}`,
  water: `${P}2479095/pexels-photo-2479095.jpeg${Q}`,
  sandwich: `${P}5639689/pexels-photo-5639689.jpeg${Q}`,
};
const slugify = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const categories = ['Burgers', 'Wraps', 'Snacks', 'Beverages', 'Regular Pizza', 'Pizza Treat', 'Café Special', 'Pizza Deals', 'Deals', 'New Additions', 'Pasta', 'Extras']
  .map((name, index) => ({ name, slug: slugify(name), sortOrder: index + 1, isActive: true }));

const foods = [];
function add(name, category, basePrice, image, extra = {}) {
  foods.push({
    name, slug: slugify(name), category, subCategory: category, basePrice, image,
    description: extra.description || `${name} — fresh from the Café 007 kitchen.`,
    sizes: extra.sizes || [], isAvailable: true, isPopular: Boolean(extra.isPopular), isFeatured: false, flavours: extra.flavours || [],
  });
}

// Burgers
[['Zinger', 350], ['Fillet Burger', 400], ['Zinger Tower', 500], ['Mighty Zinger', 550], ['Patty', 270], ['Chaply Patty', 270],
 ['B.B.Q Patty Tower', 420], ['Pizza Burger', 400], ['Jalapeno Burger', 380], ['Grilled Burger', 450]]
  .forEach(([n, p]) => add(n, 'Burgers', p, IMG.burger, { isPopular: n === 'Zinger' }));
add('Burger', 'Burgers', 320, IMG.burger, { flavours: ['Tikka', 'Fajita', 'Mughlai', 'Achari'] });

// Wraps
[['Shawarma', 300], ['Cheese Shawarma', 350], ['Zinger Shawarma', 350], ['Pocket Shawarma', 350], ['Paratha Roll', 320],
 ['Cheese Paratha Roll', 350], ['Kebab Paratha Roll', 300], ['Special Paratha Roll', 400], ['Zinger Pratha Roll', 350],
 ['Behari Roll', 700], ['Platter', 600], ['Zingeratha', 600], ['Fillet Wrap', 650], ['Kebab Bites', 700]]
  .forEach(([n, p]) => add(n, 'Wraps', p, IMG.wrap, { isPopular: n === 'Cheese Shawarma' }));
add('Paratha', 'Wraps', 300, IMG.wrap, { flavours: ['Chapli', 'BBQ Tikka', 'Garlic', 'Mughlai'] });
add('Tortilla', 'Wraps', 600, IMG.wrap, { flavours: ['Mughlai', 'Tikka', 'Fajita', 'Kebab', 'Malai'] });

// Snacks
[['Fries', 300, IMG.fries], ['Family Fries', 450, IMG.fries], ['Garlic Fries', 450, IMG.fries], ['Loaded Fries / Pizza Fries', 800, IMG.fries],
 ['5 Wings / 5 Nuggets', 280, IMG.chicken], ['10 Wings', 500, IMG.chicken], ['10 Nuggets', 500, IMG.chicken], ['Club Sandwich', 450, IMG.sandwich],
 ['5 Garlic Mayo Wings / Grilled Wings', 300, IMG.chicken], ['10 Garlic Mayo Wings / Grilled Wings', 560, IMG.chicken], ['Doner', 750, IMG.wrap]]
  .forEach(([n, p, img]) => add(n, 'Snacks', p, img, { isPopular: n === 'Loaded Fries / Pizza Fries' }));
['Pizza Paratha', 'Pizza Shawarma'].forEach(n => add(n, 'Snacks', 620, IMG.wrap, { flavours: ['Tikka', 'Fajita', 'Mughlai', 'Achari'] }));
add('Pizza Sandwich', 'Snacks', 550, IMG.wrap, { flavours: ['Tikka', 'Fajita', 'Mughlai', 'Achari'] });

// Beverages
[['Regular Drink', 70, IMG.drink], ['500ml Drink', 130, IMG.drink], ['1 Liter Drink', 190, IMG.drink], ['1.5 Liter Drink', 240, IMG.drink],
 ['M - Water 500ml', 70, IMG.water], ['M - Water 1.5 Liter', 130, IMG.water]]
  .forEach(([n, p, img]) => add(n, 'Beverages', p, img));

// Pizzas (official Small / Medium / Large prices)
const tiers = [
  ['Regular Pizza', [620, 980, 1350], ['Chicken Tikka', 'Chicken Fajita', 'Fajita Sicilian', 'Hot & Spicy', 'Chicken Achari', 'Chicken Tandoori', 'Veggie Lover', 'Cheese Lover']],
  ['Pizza Treat', [680, 1180, 1550], ['Bonefire Pizza', 'Super Supreme', 'Chicken Kebab', 'Creamy Pizza', 'Pepperoni Pizza', 'Extreme Pizza', 'Garlic Pizza', 'Chapli Pizza']],
  ['Café Special', [800, 1300, 1800], ['Shahi Crust', 'Nawabi Crust', 'Royal Crust', 'Kabah Crust', 'Pluff & Crust', 'Kebabish Crust', 'Behari Kabab', 'Mughlai Pizza', '2x Pizza', 'Malai Boti Pizza', 'Lazania Pizza', 'Steak Pizza']],
];
tiers.forEach(([category, [s, m, l], names]) => names.forEach(n => add(n, category, s, IMG.pizza, {
  sizes: [{ name: 'Small', price: s }, { name: 'Medium', price: m }, { name: 'Large', price: l }],
  isPopular: n === 'Chicken Fajita',
  description: `A ${category === 'Regular Pizza' ? 'classic' : 'signature'} pizza from the Café 007 menu. Pick your size and make it a pizza kind of day.`,
})));

// New additions, pasta, extras
add('Half Broast', 'New Additions', 750, IMG.chicken, { flavours: ['Leg & breast', 'Thigh & wing'], description: 'Leg & breast / thigh & wing. Please confirm accompanying sides with the branch.' });
add('Full Broast', 'New Additions', 1400, IMG.chicken, { description: '1 leg, 1 breast, 1 thigh, 1 wing. Please confirm accompanying sides with the branch.' });
add('Flaming Pasta', 'Pasta', 450, IMG.pasta, { sizes: [{ name: 'Small', price: 450 }, { name: 'Large', price: 800 }], description: 'A fiery pasta favourite. Choose a half or full portion.' });
add('Creamy Pasta', 'Pasta', 450, IMG.pasta, { sizes: [{ name: 'Small', price: 450 }, { name: 'Large', price: 800 }], description: 'Creamy comfort, ready to share. Choose a half or full portion.' });
add('Fettuccine Alfredo Pasta', 'Pasta', 900, IMG.pasta);
['Dip Sauce', 'Garlic Sauce', 'Mustard Sauce', 'Cheese Slice'].forEach(n => add(n, 'Extras', 70, IMG.fries));
add('Extra Topping', 'Extras', 100, IMG.pizza, { sizes: [{ name: 'Small', price: 100 }, { name: 'Medium', price: 150 }, { name: 'Large', price: 200 }] });

// Deals 1–26 (Family Deal = deal 12)
const dealRows = [
  [['1 Zinger Burger', '1 Regular Drink'], 400], [['1 Patty Burger', '1 Regular Drink'], 320],
  [['1 Zinger Burger', '1 Regular Fries', '1 Regular Drink'], 600], [['1 Filled Burger', '1 Regular Drink'], 450],
  [['1 Zinger Tower', '1 Regular Fries', '1 Regular Drink'], 700], [['1 Pizza Fries', '1 Regular Drink'], 850],
  [['5 Hot Wings', '1 Regular Drink'], 330], [['10 Hot Wings', '1 Regular Drink'], 550],
  [['1 Zinger Burger', '5 Hot Wings', '1 Regular Fries', '500ml Drink'], 850], [['1 Cheese Sticks', '1 Regular Drink'], 700],
  [['2 Zinger Burgers', '1 Regular Fries', '500ml Drink'], 950], [['5 Zinger Burgers', '1 Family Fries', '1.5 Liter Drink'], 2300],
  [['1 Special Might Zinger Burger', '1 Regular Fries', '1 Regular Drink'], 800], [['1 Club Sandwich', '1 Regular Fries', '1 Regular Drink'], 650],
  [['1 Mughlai / Tikka Burger', '1 Regular Fries', '1 Regular Drink'], 550], [['1 Doner', '500ml Drink'], 830],
  [['5 Paratha Rolls', '1 Liter Drink'], 1650], [['5 Shawarmas', '1 Liter Drink'], 1550],
  [['10 Chicken Nuggets', '1 Regular Drink'], 550], [['2 Zinger Burgers', '5 Hot Wings', '1 Regular Fries', '500ml Drink'], 1200],
  [['1 Chapli Burger', '1 Regular Drink'], 320], [['1 BBQ Patty Tower Burger', '1 Regular Drink'], 460],
  [['1 Jalapeno Burger', '1 Regular Drink'], 420], [['1 Grilled Zinger', '1 Regular Drink'], 480],
  [['3 Zinger Burgers', '1 Liter Drink'], 1150], [['1 Zinger Burger', '1 Paratha Roll', '500ml Drink'], 750],
];
const bigDeals = [
  [['2 Small Pizzas', '500ml Drink'], 1300], [['2 Medium Pizzas', '1 Liter Drink'], 2000],
  [['1 Large Pizza', '1 Medium Pizza', '1.5 Liter Drink'], 2400], [['1 Large Pizza', '10 Hot Wings', '1.5 Liter Drink'], 1950],
  [['1 Medium Pizza', '10 Hot Wings', '1 Liter Drink'], 1550], [['1 Small Pizza', '5 Hot Wings', '500ml Drink'], 950],
  [['1 Medium Pizza', '1 Small Pizza', '1 Liter Drink'], 1650], [['2 Large Pizzas', '1.5 Liter Drink'], 2750],
  [['2 Large Pizzas', '2 Zinger Burgers', '20 Hot Wings', '1 Family Fries', '2 x 1.5 Liter Drinks'], 5700],
  [['3 Large Pizzas', '3 Medium Pizzas', '2 Family Fries', '2 x 1.5 Liter Drinks'], 8000],
];
const deals = [
  ...dealRows.map(([items, price], i) => ({ name: i === 11 ? 'Family Deal' : `Deal ${i + 1}`, slug: `deal-${i + 1}`, items, price, image: IMG.deal, isAvailable: true })),
  ...bigDeals.map(([items, price], i) => ({ name: `Big Deal ${i + 1}`, slug: `big-deal-${i + 1}`, items, price, image: IMG.pizza, isAvailable: true })),
];

// Official branches from the menu (empty fields = not printed on the menu; fill when confirmed)
const branches = [
  { name: 'Mailsi', slug: 'mailsi', address: '1-km Vehari Road, Near NADRA Office, Mailsi', phone: '067-3751007, 0300-1294007, 0311-1134007', openingHours: '', deliveryAvailable: true, isActive: true },
  { name: 'Burewala', slug: 'burewala', address: '', phone: '', openingHours: 'MAIN BRANCH BUREWALA', deliveryAvailable: false, isActive: true },
  { name: 'Islamabad', slug: 'islamabad', address: '', phone: '', openingHours: 'Islamabad (Enclave / Bahria)', deliveryAvailable: false, isActive: true },
  { name: 'Sialkot', slug: 'sialkot', address: '', phone: '', openingHours: '', deliveryAvailable: false, isActive: true },
  { name: 'Daska', slug: 'daska', address: '', phone: '', openingHours: '', deliveryAvailable: false, isActive: true },
  { name: 'Gaggo', slug: 'gaggo', address: '', phone: '', openingHours: '', deliveryAvailable: false, isActive: true },
  { name: 'Machiwal', slug: 'machiwal', address: '', phone: '', openingHours: '', deliveryAvailable: false, isActive: true },
  { name: '455/EB BRW', slug: '455-eb-brw', address: '', phone: '', openingHours: '', deliveryAvailable: false, isActive: true },
  { name: 'Garhamore', slug: 'garhamore', address: '', phone: '', openingHours: '', deliveryAvailable: false, isActive: true },
  { name: 'Ghaziabad', slug: 'ghaziabad', address: '', phone: '', openingHours: '', deliveryAvailable: false, isActive: true },
];

module.exports = { categories, foods, deals, branches, slugify };