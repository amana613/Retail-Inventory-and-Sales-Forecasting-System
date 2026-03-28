import express from 'express';
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  getPaymentsByOrderId,
  getPaymentsByUserId,
  updatePaymentStatus,
} from '../controllers/paymentController.js';

const router = express.Router();

// POST - Create a new payment
router.post('/', createPayment);

// GET - Get all payments
router.get('/', getAllPayments);

// GET - Get payment by ID
router.get('/:paymentId', getPaymentById);

// GET - Get payments by order ID
router.get('/order/:orderId', getPaymentsByOrderId);

// GET - Get payments by user ID
router.get('/user/:user_id', getPaymentsByUserId);

// PUT - Update payment status
router.put('/:paymentId/status', updatePaymentStatus);

export default router;
