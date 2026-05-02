import { Router } from "express";
import { login, register, verifyToken } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login",    login);
router.post("/register", register);
router.get("/verify",    authenticate, verifyToken);

export default router;