import express from 'express';
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  getIncomingOrders,
  confirmOrder,
  assignRider,
} from '../controllers/orderController.js';

const router = express.Router();

// POST - Create a new order
router.post('/', createOrder);

// GET - Get all orders
router.get('/', getAllOrders);

// GET - Get incoming orders (paid and pending)
router.get('/admin/incoming', getIncomingOrders);

// GET - Get orders by user ID
router.get('/user/:id', getUserOrders);

// PUT - Confirm order
router.put('/:orderId/confirm', confirmOrder);

// PUT - Assign rider to order
router.put('/:orderId/assign-rider', assignRider);

// PUT - Update order status
router.put('/:id/status', updateOrderStatus);

// DELETE - Cancel order
router.delete('/:id', cancelOrder);

export default router;
