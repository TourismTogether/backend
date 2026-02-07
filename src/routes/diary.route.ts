import express, { Router } from "express";
import { diaryController } from "../controllers/diary.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createLimiter } from "../middlewares/security.middleware";

const router: Router = express.Router();

router.get("/", diaryController.getAllDiaries);
router.get("/:id", diaryController.getDiaryById);
router.get("/trip/:trip_id", diaryController.getDiariesByTripId);
router.post("/", authenticateToken, createLimiter, diaryController.createDiary);
router.patch("/:id", authenticateToken, diaryController.updateDiaryById);
router.delete("/:id", authenticateToken, diaryController.deleteDiaryById);

export default router;