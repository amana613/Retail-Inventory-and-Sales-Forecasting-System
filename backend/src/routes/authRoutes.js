import express from "express";
import { getRiders, login, register } from "../controllers/authController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/mock-riders", protect, authorize("admin"), getRiders);

export default router;
