import express from "express";
import {
	changePassword,
	getMe,
	getRiders,
	login,
	register,
	updateMe
} from "../controllers/authController.js";
import { authorize, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/mock-riders", protect, authorize("admin"), getRiders);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.patch("/change-password", protect, changePassword);

export default router;
