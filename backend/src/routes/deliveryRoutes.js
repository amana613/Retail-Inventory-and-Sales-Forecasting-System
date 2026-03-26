import express from "express";
import {
  assignRider,
  getAllDeliveries,
  getMyDeliveries,
  updateDeliveryStatus
} from "../controllers/deliveryController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/assign", protect, authorize("admin"), assignRider);
router.get("/", protect, authorize("admin"), getAllDeliveries);
router.get("/my", protect, authorize("rider"), getMyDeliveries);
router.patch("/:id/status", protect, authorize("rider", "admin"), updateDeliveryStatus);

export default router;
