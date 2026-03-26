import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  updateProductStock
} from "../controllers/productController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.patch("/:id/stock", protect, authorize("admin"), updateProductStock);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
