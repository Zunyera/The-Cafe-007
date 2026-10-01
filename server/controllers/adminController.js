const Category = require('../models/Category');
const Deal = require('../models/Deal');
const Food = require('../models/Food');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Branch = require('../models/Branch');

exports.dashboard = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, pendingOrders, totalCustomers, totalFoods, totalCategories, totalDeals, totalBranches, totalReservations, revenue, recent] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ status: 'Pending' }),
      User.countDocuments({ role: 'customer' }),
      Food.countDocuments(),
      Category.countDocuments(),
      Deal.countDocuments(),
      Branch.countDocuments(),
      Reservation.countDocuments(),
      Order.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name').populate('branch', 'name'),
    ]);

    return res.json({
      totalOrders,
      todayOrders,
      pendingOrders,
      totalRevenue: revenue[0] ? revenue[0].total : 0,
      totalCustomers,
      totalFoods,
      totalCategories,
      totalDeals,
      totalBranches,
      totalReservations,
      recentOrders: recent.map(order => ({
        _id: order._id,
        user: order.user && order.user.name ? order.user.name : order.phone,
        branch: order.branch && order.branch.name ? order.branch.name : 'Not selected',
        totalAmount: order.totalAmount,
        status: order.status,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

exports.customers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
    return res.json({ customers: users, count: users.length });
  } catch (error) {
    return next(error);
  }
};

exports.updateCustomerStatus = async (req, res, next) => {
  try {
    const isActive = req.body.isActive !== false;
    const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'customer' }, { isActive }, { new: true });
    if (!user) return res.status(404).json({ message: 'Customer not found.' });
    return res.json({ customer: user });
  } catch (error) {
    return next(error);
  }
};