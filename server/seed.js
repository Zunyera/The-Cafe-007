require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/database');
const Category = require('./models/Category');
const Deal = require('./models/Deal');
const Food = require('./models/Food');
const Branch = require('./models/Branch');
const User = require('./models/User');
const { categories, foods, deals, branches } = require('./seedData');

async function run() {
  await connectDB();
  await Category.deleteMany({});
  await Food.deleteMany({});
  await Deal.deleteMany({});
  await Branch.deleteMany({});

  const categoryDocs = await Category.insertMany(categories);
  const categoryByName = new Map(categoryDocs.map(doc => [doc.name, doc._id]));

  await Food.insertMany(foods.map(food => ({ ...food, category: categoryByName.get(food.category) })));
  await Deal.insertMany(deals);
  await Branch.insertMany(branches);

  const email = String(process.env.ADMIN_EMAIL || 'admin@cafe007.com').toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || 'Admin@123');
  if (!(await User.findOne({ email }))) {
    await User.create({ name: 'Cafe 007 Admin', email, password: await bcrypt.hash(password, 10), phone: '067-3751007', role: 'admin', isActive: true });
    console.log(`Admin created: ${email} / ${password}`);
  } else {
    console.log(`Admin already exists: ${email}`);
  }

  console.log(`Seeded ${categories.length} categories, ${foods.length} foods, ${deals.length} deals, ${branches.length} branches.`);
  process.exit(0);
}

run().catch(error => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});