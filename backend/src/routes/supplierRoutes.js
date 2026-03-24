import express from 'express';
import {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier
} from '../controllers/supplierController.js';

const router = express.Router();

router.route('/').get(getAllSuppliers).post(createSupplier);
router.route('/:id').put(updateSupplier).delete(deleteSupplier);

export default router;