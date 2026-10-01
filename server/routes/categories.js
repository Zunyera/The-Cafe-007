const router = require('express').Router();
const Category = require('../models/Category');
const { makeCrud } = require('../controllers/crudFactory');
const { protect, adminOnly } = require('../middleware/auth');

const crud = makeCrud(Category, 'categories');
router.get('/', crud.list);
router.post('/', protect, adminOnly, crud.create);
router.delete('/:id', protect, adminOnly, crud.remove);

module.exports = router;