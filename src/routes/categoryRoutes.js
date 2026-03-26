import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getCategories).post(createCategory);
router.route('/:id').get(getCategoryById);

export default router;