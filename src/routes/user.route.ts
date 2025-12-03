import express, { Router } from "express";
import userController from "../controllers/user.controller";

const router: Router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

export default router;