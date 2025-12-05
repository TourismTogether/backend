import express, { Router } from "express";
import supporterController from "../controllers/supporter.controller";

const router: Router = express.Router();

router.get("/", supporterController.getAllSupporters);
router.get("/:user_id", supporterController.getSupporterById);
router.post("/", supporterController.createSupporter);
router.patch("/:user_id", supporterController.updateSupporterById);
router.delete("/:user_id", supporterController.deleteSupporterById);

export default router;