import express from 'express';
import {
  createPurchase,
  getPurchaseById,
  confirmPurchase
} from '../controllers/purchaseController.js';

const router = express.Router();

router.route('/').post(createPurchase);
router.route('/:id').get(getPurchaseById);
router.route('/:id/confirm').put(confirmPurchase);

export default router;