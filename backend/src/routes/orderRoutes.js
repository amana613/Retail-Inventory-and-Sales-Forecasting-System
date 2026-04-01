import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
  updateOrderToPaid,
} from '../controllers/orderController.js';
import { protect, admin, rider, adminOrRider } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, adminOrRider, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, adminOrRider, updateOrderToDelivered);
router.route('/:id/pay').put(protect, admin, updateOrderToPaid);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
