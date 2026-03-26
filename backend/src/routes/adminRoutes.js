import express from "express";
import {
  forecastDemand,
  getAdminOrderHistory
} from "../controllers/adminController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/forecast", protect, authorize("admin"), forecastDemand);
router.get("/orders/history", protect, authorize("admin"), getAdminOrderHistory);

export default router;
