const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedAdmin() {
  const email = String(process.env.ADMIN_EMAIL || 'admin@cafe007.com').toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || 'Admin@123');
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
    }
    return existing;
  }
  const admin = await User.create({
    name: 'Cafe 007 Admin',
    email,
    password: await bcrypt.hash(password, 10),
    phone: '067-3751007',
    role: 'admin',
    isActive: true,
  });
  console.log(`Admin ready: ${email} / ${password}`);
  return admin;
}

module.exports = seedAdmin;