const Branch = require('../models/Branch');
const Reservation = require('../models/Reservation');
const { slugify } = require('./crudFactory');

async function resolveBranch(value) {
  if (!value) return null;
  const raw = String(value);
  if (/^[0-9a-fA-F]{24}$/.test(raw)) return raw;
  const found = await Branch.findOne({ slug: slugify(raw) });
  return found ? found._id : null;
}

exports.createReservation = async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const phone = String(req.body.phone || '').trim();
    const date = String(req.body.date || '').trim();
    const time = String(req.body.time || '').trim();
    const guests = Math.floor(Number(req.body.guests) || 0);

    if (name.length < 2) return res.status(400).json({ message: 'Please enter your full name.' });
    if (!phone) return res.status(400).json({ message: 'Please enter a phone number.' });
    if (!date || !time) return res.status(400).json({ message: 'Please choose a date and time.' });
    if (guests < 1 || guests > 99) return res.status(400).json({ message: 'Guests must be between 1 and 99.' });

    const reservation = await Reservation.create({
      user: req.user._id,
      name,
      phone,
      branch: await resolveBranch(req.body.branch),
      date,
      time,
      guests,
      specialRequest: String(req.body.specialRequest || '').slice(0, 800),
      status: 'Pending',
    });
    return res.status(201).json({ reservation });
  } catch (error) {
    return next(error);
  }
};

exports.myReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id }).populate('branch', 'name slug').sort({ createdAt: -1 });
    return res.json({ reservations, count: reservations.length });
  } catch (error) {
    return next(error);
  }
};

exports.allReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().populate('user', 'name email phone').populate('branch', 'name slug').sort({ createdAt: -1 });
    return res.json({ reservations, count: reservations.length });
  } catch (error) {
    return next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const allowed = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
    const status = String(req.body.status || '');
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Unknown reservation status.' });
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('user', 'name email phone').populate('branch', 'name slug');
    if (!reservation) return res.status(404).json({ message: 'Reservation not found.' });
    return res.json({ reservation });
  } catch (error) {
    return next(error);
  }
};

// Customer sirf apni reservation cancel kar sakta hai.
exports.cancelOwnReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found.' });
    if (String(reservation.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only cancel your own reservation.' });
    }
    if (reservation.status === 'Completed') return res.status(400).json({ message: 'This reservation is already completed.' });
    reservation.status = 'Cancelled';
    await reservation.save();
    return res.json({ reservation });
  } catch (error) {
    return next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found.' });
    return res.json({ message: 'Reservation deleted.' });
  } catch (error) {
    return next(error);
  }
};