import express from "express";
import {
  cancelOrder,
  confirmOrder,
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrder
} from "../controllers/orderController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("customer", "admin"), createOrder);
router.get("/my", protect, authorize("customer"), getMyOrders);
router.get("/", protect, authorize("admin"), getAllOrders);
router.put("/:id", protect, updateOrder);
router.patch("/:id/cancel", protect, cancelOrder);
router.patch("/:id/confirm", protect, authorize("admin"), confirmOrder);

export default router;
