const router = require('express').Router();
const orders = require('../controllers/orderController');
const { adminOnly, protect } = require('../middleware/auth');

router.post('/', protect, orders.createOrder);
router.get('/my-orders', protect, orders.myOrders);
router.get('/', protect, adminOnly, orders.allOrders);
router.get('/:id', protect, orders.getOrder);
router.put('/:id/status', protect, adminOnly, orders.updateStatus);

module.exports = router;