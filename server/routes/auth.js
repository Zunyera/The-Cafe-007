const router = require('express').Router();
const auth = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/me', protect, auth.me);
router.put('/profile', protect, auth.updateProfile);
router.put('/settings', protect, auth.updateAdminSettings);

module.exports = router;