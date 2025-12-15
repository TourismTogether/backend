import express from "express";
import assessTripController from "../controllers/assessTrip.controller";

const router = express.Router();

router.get("/trip/:tripId", assessTripController.getByTrip);
router.post("/", assessTripController.create);
router.patch("/", assessTripController.update);
router.delete("/", assessTripController.delete);

export default router;
