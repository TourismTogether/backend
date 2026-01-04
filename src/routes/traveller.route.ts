import express, { Router } from "express";
import travellerController from "../controllers/traveller.controller";

const router: Router = express.Router();

router.get("/", travellerController.getAllTraveller);
router.get("/:user_id", travellerController.getTravellerById);
router.get("/:user_id/diaries", travellerController.getListDiaries);
router.get("/:user_id/posts", travellerController.getListPosts);
router.post("/", travellerController.createTraveller);
router.patch("/:user_id", travellerController.updateTravellerById);
router.delete("/:user_id", travellerController.deleteTravellerById);

export default router;