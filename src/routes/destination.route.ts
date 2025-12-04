import express, { Router } from "express";
import destinationController from "../controllers/destination.controller";

const router: Router = express.Router();

router.get("/", destinationController.getAllDestination);
router.get("/:id", destinationController.getDestinationById);
router.post("/", destinationController.createDestination);
router.patch("/:id", destinationController.updateDestinationById);
router.delete("/:id", destinationController.deleteDestinationById);

export default router;