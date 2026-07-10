const express = require('express');
const ctrl = require('../controllers/product.controller');
const router = express.Router();

router.route('/').get(ctrl.getProducts).post(ctrl.createProduct);
router.route('/:id').get(ctrl.getProduct).patch(ctrl.updateProduct).delete(ctrl.deleteProduct);

module.exports = router;