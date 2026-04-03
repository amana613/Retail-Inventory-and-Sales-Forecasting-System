import express from 'express';
import {
  getReviewsByProduct,
  createReview,
  deleteReview,
  updateReview,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get reviews for a product (public)
router.get('/product/:productId', getReviewsByProduct);

// Create a review (protected - logged in users)
router.post('/', protect, createReview);

// Update a review (protected - user who created it)
router.put('/:id', protect, updateReview);

// Delete a review (protected - user who created it or admin)
router.delete('/:id', protect, deleteReview);

export default router;
