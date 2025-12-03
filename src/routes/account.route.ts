import express, { Router } from "express";
import accountController from "../controllers/account,controller";

const router: Router = express.Router();

router.get("/", accountController.getAllAccounts);
router.post("/", accountController.createAccount);
router.patch("/:id", accountController.updatedAccount);
router.delete("/:id", accountController.deleteAccount);

export default router;