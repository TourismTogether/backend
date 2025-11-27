import express, { Router } from "express";
import authController from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/signup", authController.signUp);

export default router;