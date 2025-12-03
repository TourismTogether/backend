import express, { Router } from "express";
import tripController from "../controllers/trip.controller";

const router: Router = express.Router();

router.get("/", tripController.getAllTrips);
router.get("/:id", tripController.getTripById);
router.post("/", tripController.createTrip);
router.patch("/:id", tripController.updateTripById);
router.delete("/:id", tripController.deleteTripById);

export default router;