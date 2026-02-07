import express from "express";
import assessDestinationController from "../controllers/assessDestination.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createLimiter } from "../middlewares/security.middleware";

const router = express.Router();

router.get("/destination/:destinationId", assessDestinationController.getByDestination);
router.post("/", authenticateToken, createLimiter, assessDestinationController.create);
router.patch("/", authenticateToken, assessDestinationController.update);
router.delete("/", authenticateToken, assessDestinationController.delete);

export default router;
