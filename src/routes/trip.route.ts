import express, { Router } from "express";
import tripController from "../controllers/trip.controller";
import { tripValidators } from "../middlewares/validation.middleware";
import { authenticateToken, optionalAuth } from "../middlewares/auth.middleware";
import { createLimiter } from "../middlewares/security.middleware";

const router: Router = express.Router();

// Public routes (optional auth for personalized results)
router.get("/", optionalAuth, tripController.getAllTrips);
router.get("/:id", optionalAuth, tripValidators.tripId, tripController.getTripById);
router.get("/:id/users", optionalAuth, tripValidators.tripId, tripController.getTripMembers);
router.get("/:id/routes", optionalAuth, tripValidators.tripId, tripController.getListRoutes);
router.get("/:id/diaries", optionalAuth, tripValidators.tripId, tripController.getListDiaries);

// Protected routes (require authentication)
router.post("/", authenticateToken, createLimiter, tripValidators.createTrip, tripController.createTrip);
router.post("/:id/join", authenticateToken, tripValidators.tripId, tripController.joinTrip);
router.post("/:trip_id/users/:user_id", authenticateToken, tripController.addTripMember);
router.patch("/:id", authenticateToken, tripValidators.updateTrip, tripController.updateTripById);

// Specific routes must come before generic routes to avoid route matching conflicts
router.delete("/:trip_id/users/:user_id", authenticateToken, tripController.deleteTripMember);
router.delete("/:id", authenticateToken, tripValidators.tripId, tripController.deleteTripById);

export default router;