import express from "express";
import {
  createReview,
  deleteReview,
  getReviewsByProduct,
  updateReview
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/product/:productId", getReviewsByProduct);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;
