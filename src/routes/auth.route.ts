import express, { Router } from "express";
import authController from "../controllers/auth.controller";
import { authValidators } from "../middlewares/validation.middleware";
import { authLimiter } from "../middlewares/security.middleware";
import { authenticateToken } from "../middlewares/auth.middleware";

const router: Router = express.Router();

// Apply stricter rate limiting to auth routes
router.post("/signup", authLimiter, authValidators.signUp, authController.signUp);
router.post("/signin", authLimiter, authValidators.signIn, authController.signIn);
router.get("/user", authenticateToken, authController.getCurUser);
router.post("/logout", authenticateToken, authController.logOut);

export default router;