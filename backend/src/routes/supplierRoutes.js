import express from "express";
import {
  getSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, admin, getSuppliers)
  .post(protect, admin, createSupplier);

router
  .route("/:id")
  .get(protect, admin, getSupplierById)
  .put(protect, admin, updateSupplier)
  .delete(protect, admin, deleteSupplier);

export default router;
