import express from "express";
import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier
} from "../controllers/supplierController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getSuppliers);
router.get("/:id", protect, getSupplierById);
router.post("/", protect, authorize("admin"), createSupplier);
router.put("/:id", protect, authorize("admin"), updateSupplier);
router.delete("/:id", protect, authorize("admin"), deleteSupplier);

export default router;
