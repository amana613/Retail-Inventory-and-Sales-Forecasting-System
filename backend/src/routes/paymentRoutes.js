import express from "express";
import { createPayment, getPayments } from "../controllers/paymentController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("customer", "admin"), createPayment);
router.get("/", protect, authorize("admin"), getPayments);

export default router;
