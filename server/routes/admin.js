const router = require('express').Router();
const admin = require('../controllers/adminController');
const reservations = require('../controllers/reservationController');
const { adminOnly, protect } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/dashboard', admin.dashboard);
router.get('/customers', admin.customers);
router.put('/customers/:id/status', admin.updateCustomerStatus);
router.get('/reservations', reservations.allReservations);

module.exports = router;