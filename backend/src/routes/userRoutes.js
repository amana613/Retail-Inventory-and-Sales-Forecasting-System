import express from 'express';
import { getUsers, createUser, deleteUser } from '../controllers/userController.js';
import { protect, superAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, superAdmin, getUsers)
  .post(protect, superAdmin, createUser);

router.route('/:id')
  .delete(protect, superAdmin, deleteUser);

export default router;