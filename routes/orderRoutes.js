const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

router.route('/').get(getOrders).post(createOrder);
router.route('/:id').get(getOrderById).delete(deleteOrder);
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;
