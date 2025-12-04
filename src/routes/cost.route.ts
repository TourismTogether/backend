import express, { Router } from "express";
import costController from "../controllers/cost.controller";

const router: Router = express.Router();

router.get("/", costController.getAllCost);
router.get("/:id", costController.getCostById);
router.post("/", costController.createCost);
router.patch("/:id", costController.updateCostById);
router.delete("/:id", costController.deleteCostById);


export default router;