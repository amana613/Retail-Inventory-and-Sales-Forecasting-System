import express from 'express';
import {
  createCategory,
  getCategories
} from '../controllers/categoryController.js';

const router = express.Router();

router.route('/').get(getCategories).post(createCategory);

export default router;