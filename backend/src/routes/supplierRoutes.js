import express from 'express';
import { getSuppliers, createSupplier, deleteSupplier } from '../controllers/supplierController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getSuppliers).post(protect, admin, createSupplier);
router.route('/:id').delete(protect, admin, deleteSupplier);

export default router;
