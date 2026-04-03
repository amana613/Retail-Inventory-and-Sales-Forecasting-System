import express from "express";
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
  updateOrderToPaid,
  assignRider,
  uploadReceipt,
} from "../controllers/orderController.js";
import {
  protect,
  admin,
  rider,
  adminOrRider,
} from "../middlewares/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, adminOrRider, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/assign").put(protect, admin, assignRider);
router.route("/:id/deliver").put(protect, adminOrRider, updateOrderToDelivered);
router.route("/:id/pay").put(protect, admin, updateOrderToPaid);
router.route("/:id/status").put(protect, adminOrRider, updateOrderStatus);
router
  .route("/:id/receipt")
  .post(protect, upload.single("receiptImage"), uploadReceipt);

export default router;
