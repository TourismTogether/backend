import express, { Router } from "express";
import authController from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.get("/user", authController.getCurUser);
router.post("/logout", authController.logOut);

export default router;