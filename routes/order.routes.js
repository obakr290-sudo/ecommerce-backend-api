const express = require('express');
const ctrl = require('../controllers/order.controller');
const router = express.Router();

router.route('/').get(ctrl.getAllOrders).post(ctrl.checkout);
router.route('/:id').get(ctrl.getOrder);
router.route('/:id/status').patch(ctrl.updateStatus);

module.exports = router;