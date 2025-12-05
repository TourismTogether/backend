import express, { Router } from "express";
import { diaryController } from "../controllers/diary.controller";

const router: Router = express.Router();

router.get("/", diaryController.getAllDiaries);
router.get("/:id", diaryController.getDiaryById);
router.get("/trip/:trip_id", diaryController.getDiariesByTripId);
router.post("/", diaryController.createDiary);
router.patch("/:id", diaryController.updateDiaryById);
router.delete("/:id", diaryController.deleteDiaryById);

export default router;