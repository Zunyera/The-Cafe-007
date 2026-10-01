const router = require('express').Router();
const Deal = require('../models/Deal');
const { makeCrud } = require('../controllers/crudFactory');
const { protect, adminOnly } = require('../middleware/auth');

const crud = makeCrud(Deal, 'deals');
router.get('/', crud.list);
router.post('/', protect, adminOnly, crud.create);
router.put('/:id', protect, adminOnly, crud.update);
router.delete('/:id', protect, adminOnly, crud.remove);

module.exports = router;