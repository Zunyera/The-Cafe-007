const router = require('express').Router();
const Branch = require('../models/Branch');
const { makeCrud } = require('../controllers/crudFactory');
const { protect, adminOnly } = require('../middleware/auth');

const crud = makeCrud(Branch, 'branches');
router.get('/', crud.list);
router.post('/', protect, adminOnly, crud.create);
router.put('/:id', protect, adminOnly, crud.update);
router.delete('/:id', protect, adminOnly, crud.remove);

module.exports = router;