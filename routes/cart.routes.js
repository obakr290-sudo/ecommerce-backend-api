const express = require('express');
const ctrl = require('../controllers/cart.controller');
const router = express.Router();

router.route('/').get(ctrl.getCart).delete(ctrl.clearCart);
router.route('/items').post(ctrl.addToCart);
router.route('/items/:productId').patch(ctrl.updateCartItem);

module.exports = router;