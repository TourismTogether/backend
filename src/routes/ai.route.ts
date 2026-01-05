import express, { Router } from "express";
import aiRoutePlannerController from "../controllers/aiRoutePlanner.controller";

const router: Router = express.Router();

router.post("/generate-itinerary", aiRoutePlannerController.generateItinerary);
router.post("/generate-diary", aiRoutePlannerController.generateDiary);

export default router;

