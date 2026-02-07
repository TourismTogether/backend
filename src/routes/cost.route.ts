import express, { Router } from "express";
import costController from "../controllers/cost.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createLimiter } from "../middlewares/security.middleware";

const router: Router = express.Router();

router.get("/", costController.getAllCost);
router.get("/:id", costController.getCostById);
router.post("/", authenticateToken, createLimiter, costController.createCost);
router.patch("/:id", authenticateToken, costController.updateCostById);
router.delete("/:id", authenticateToken, costController.deleteCostById);

export default router;