import express from 'express';
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getLowStockProducts
} from '../controllers/productController.js';

const router = express.Router();

// Special route for low stock products (before :id routes to avoid conflicts)
router.route('/low-stock').get(getLowStockProducts);

// ID-based routes
router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').put(updateProduct).delete(deleteProduct);

export default router;