import express, { Router } from "express";
import aiRoutePlannerController from "../controllers/aiRoutePlanner.controller";

const router: Router = express.Router();

router.post("/generate-itinerary", aiRoutePlannerController.generateItinerary);

export default router;

