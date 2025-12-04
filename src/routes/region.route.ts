import express, { Router } from "express";
import regionController from "../controllers/region.controller";

const router: Router = express.Router();

router.get("/", regionController.getAllRegion);
router.post("/", regionController.createRegion);
router.patch("/:id", regionController.updateRegionById);
router.delete("/:id", regionController.deleteRegionById);

export default router;