import express, { Router } from "express";
import routeController from "../controllers/route.controller";

const router: Router = express.Router();

router.get("/", routeController.getAllRoutes);
router.post("/", routeController.createRoute);
router.patch("/:id", routeController.updateRoute);
router.delete("/:id", routeController.deleteRoute);

export default router;