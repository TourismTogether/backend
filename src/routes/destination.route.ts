import express, { Router } from "express";
import destinationController from "../controllers/destination.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createLimiter } from "../middlewares/security.middleware";

const router: Router = express.Router();

router.get("/", destinationController.getAllDestination);
router.get("/:id", destinationController.getDestinationById);
router.post("/", authenticateToken, createLimiter, destinationController.createDestination);
router.patch("/:id", authenticateToken, destinationController.updateDestinationById);
router.delete("/:id", authenticateToken, destinationController.deleteDestinationById);

export default router;