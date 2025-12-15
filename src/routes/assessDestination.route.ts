import express from "express";
import assessDestinationController from "../controllers/assessDestination.controller";

const router = express.Router();

router.get("/destination/:destinationId", assessDestinationController.getByDestination);
router.post("/", assessDestinationController.create);
router.patch("/", assessDestinationController.update);
router.delete("/", assessDestinationController.delete);

export default router;
