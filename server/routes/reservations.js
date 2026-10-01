const router = require('express').Router();
const reservations = require('../controllers/reservationController');
const { adminOnly, protect } = require('../middleware/auth');

router.post('/', protect, reservations.createReservation);
router.get('/my-reservations', protect, reservations.myReservations);
router.put('/:id/cancel', protect, reservations.cancelOwnReservation);
router.put('/:id/status', protect, adminOnly, reservations.updateStatus);
router.delete('/:id', protect, adminOnly, reservations.remove);

module.exports = router;