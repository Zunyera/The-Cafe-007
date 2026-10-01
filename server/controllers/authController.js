const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../middleware/auth');

const isEmail = value => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const validPhone = value => typeof value === 'string' && /^[+\d\s()-]{7,20}$/.test(value) && value.replace(/\D/g, '').length >= 7;

exports.register = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const phone = String(req.body.phone || '').trim();
    const password = String(req.body.password || '');

    if (name.length < 2) return res.status(400).json({ message: 'Please enter your full name.' });
    if (!isEmail(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (!validPhone(phone)) return res.status(400).json({ message: 'Please enter a valid phone number.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashed, role: 'customer', isActive: true });
    return res.status(201).json({ token: signToken(user), user });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!isEmail(email) || !password) return res.status(400).json({ message: 'Please enter your email and password.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email or password is not correct.' });
    }
    if (user.isActive === false) return res.status(403).json({ message: 'This account is deactivated.' });

    return res.json({ token: signToken(user), user });
  } catch (error) {
    return next(error);
  }
};

exports.me = async (req, res) => res.json({ user: req.user });

exports.updateProfile = async (req, res, next) => {
  try {
    const name = String(req.body.name ?? req.user.name).trim();
    const phone = String(req.body.phone ?? req.user.phone).trim();
    if (name.length < 2) return res.status(400).json({ message: 'Please enter your full name.' });
    if (phone && !validPhone(phone)) return res.status(400).json({ message: 'Please enter a valid phone number.' });

    req.user.name = name;
    req.user.phone = phone;
    await req.user.save();
    return res.json({ user: req.user });
  } catch (error) {
    return next(error);
  }
};

exports.updateAdminSettings = async (req, res, next) => {
  try {
    const name = String(req.body.name ?? req.user.name).trim();
    const email = String(req.body.email ?? req.user.email).trim().toLowerCase();
    const phone = String(req.body.phone ?? req.user.phone).trim();
    const currentPassword = String(req.body.currentPassword || '');
    const newPassword = String(req.body.newPassword || '');

    if (name.length < 2) return res.status(400).json({ message: 'Please enter your full name.' });
    if (!isEmail(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (phone && !validPhone(phone)) return res.status(400).json({ message: 'Please enter a valid phone number.' });

    if (email !== req.user.email) {
      const exists = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (exists) return res.status(409).json({ message: 'An account with this email already exists.' });
      req.user.email = email;
    }

    req.user.name = name;
    req.user.phone = phone;

    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters.' });
      }

      const userWithPassword = await User.findById(req.user._id).select('+password');
      const ok = await bcrypt.compare(currentPassword, userWithPassword.password);
      if (!ok) {
        return res.status(400).json({ message: 'Current password is not correct.' });
      }

      req.user.password = await bcrypt.hash(newPassword, 10);
    }

    await req.user.save();
    return res.json({ user: req.user, token: signToken(req.user) });
  } catch (error) {
    return next(error);
  }
};