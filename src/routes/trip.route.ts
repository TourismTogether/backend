import express, { Router } from "express";
import tripController from "../controllers/trip.controller";

const router: Router = express.Router();

router.get("/", tripController.getAllTrips);
router.get("/:id", tripController.getTripById);
router.get("/:id/users", tripController.getTripMembers);
router.get("/:id/routes", tripController.getListRoutes);
router.get("/:id/diaries", tripController.getListDiaries);
router.post("/", tripController.createTrip);
router.post("/:id/join", tripController.joinTrip);
router.post("/:trip_id/users/:user_id", tripController.addTripMember);
router.patch("/:id", tripController.updateTripById);
// Specific routes must come before generic routes to avoid route matching conflicts
router.delete("/:trip_id/users/:user_id", tripController.deleteTripMember);
router.delete("/:id", tripController.deleteTripById);

export default router;