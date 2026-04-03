import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get user's wishlist
router.get('/', protect, getWishlist);

// Check if product is in wishlist
router.get('/check/:productId', protect, checkWishlist);

// Add product to wishlist
router.post('/add', protect, addToWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', protect, removeFromWishlist);

// Clear entire wishlist
router.delete('/clear', protect, clearWishlist);

export default router;
