import express, { Router } from "express";
import adminController from "../controllers/admin.controller";

const router: Router = express.Router();

router.get("/", adminController.getAllAdmins);
router.get("/:user_id", adminController.getAdminById);
router.post("/", adminController.createAdmin);
router.patch("/:user_id", adminController.updateAdminById);
router.delete("/:user_id", adminController.deleteAdminById);

export default router;