const Branch = require('../models/Branch');
const Order = require('../models/Order');
const { slugify } = require('./crudFactory');
const { getDeliveryFee } = require('../config/delivery');

async function resolveBranch(value) {
  if (!value) return null;
  const raw = String(value);
  if (/^[0-9a-fA-F]{24}$/.test(raw)) return raw;
  const found = await Branch.findOne({ slug: slugify(raw) });
  return found ? found._id : null;
}

exports.createOrder = async (req, res, next) => {
  try {
    const items = (Array.isArray(req.body.items) ? req.body.items : [])
      .map(item => ({
        food: /^[0-9a-fA-F]{24}$/.test(String(item.food || '')) ? item.food : null,
        name: String(item.name || '').trim(),
        quantity: Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1))),
        selectedSize: String(item.selectedSize || ''),
        price: Math.max(0, Math.round(Number(item.price) || 0)),
        image: String(item.image || ''),
        flavour: String(item.flavour || ''),
      }))
      .filter(item => item.name);

    if (!items.length) return res.status(400).json({ message: 'Your cart is empty.' });
    const phone = String(req.body.phone || '').trim();
    if (!phone) return res.status(400).json({ message: 'Please add a contact number.' });

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const paymentMethod = String(req.body.paymentMethod || 'Cash on Delivery');
    const deliveryFee = getDeliveryFee(subtotal, paymentMethod);

    const order = await Order.create({
      user: req.user._id,
      branch: await resolveBranch(req.body.branch),
      items,
      subtotal,
      deliveryFee,
      totalAmount: subtotal + deliveryFee,
      phone,
      deliveryAddress: String(req.body.deliveryAddress || ''),
      paymentMethod,
      notes: String(req.body.notes || '').slice(0, 500),
      status: 'Pending',
    });

    return res.status(201).json({ order });
  } catch (error) {
    return next(error);
  }
};

exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('branch', 'name slug').sort({ createdAt: -1 });
    return res.json({ orders, count: orders.length });
  } catch (error) {
    return next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('branch', 'name slug');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only view your own orders.' });
    }
    return res.json({ order });
  } catch (error) {
    return next(error);
  }
};

exports.allOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email phone').populate('branch', 'name slug').sort({ createdAt: -1 });
    return res.json({ orders, count: orders.length });
  } catch (error) {
    return next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const allowed = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    const status = String(req.body.status || '');
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Unknown order status.' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email phone').populate('branch', 'name slug');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    return res.json({ order });
  } catch (error) {
    return next(error);
  }
};