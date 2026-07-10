const express = require('express');
const ctrl = require('../controllers/category.controller');
const router = express.Router();

router.route('/').get(ctrl.getCategories).post(ctrl.createCategory);
router.route('/:id').get(ctrl.getCategory).patch(ctrl.updateCategory).delete(ctrl.deleteCategory);

module.exports = router;