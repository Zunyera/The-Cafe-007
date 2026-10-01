const router = require('express').Router();
const Food = require('../models/Food');
const { makeCrud } = require('../controllers/crudFactory');
const { protect, adminOnly } = require('../middleware/auth');

const crud = makeCrud(Food, 'foods');
router.get('/', crud.list);
router.get('/:id', crud.getOne);
router.post('/', protect, adminOnly, crud.create);
router.put('/:id', protect, adminOnly, crud.update);
router.delete('/:id', protect, adminOnly, crud.remove);

module.exports = router;