import express from 'express';
import { getUsers, createUser, deleteUser, getRiders } from '../controllers/userController.js';
import { protect, superAdmin, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/riders')
  .get(protect, admin, getRiders);

router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser);

router.route('/:id')
  .delete(protect, superAdmin, deleteUser);

export default router;