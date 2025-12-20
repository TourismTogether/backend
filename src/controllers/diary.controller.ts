import { Request, Response, NextFunction } from "express";
import diaryService from "../services/diary.service";

class DiaryController {
    // GET - /diaries
    async getAllDiaries(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await diaryService.findAll();
            return res.status(result.status).json(result)
        } catch (err) {
            next(err);
        }
    }

    // GET - /diaries/:id
    async getDiaryById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await diaryService.findById(id);
            return res.status(result.status).json(result)
        } catch (err) {
            next(err);
        }
    }

    // GET - diaries/trip/:trip_id
    async getDiariesByTripId(req: Request, res: Response, next: NextFunction) {
        try {
            const { trip_id } = req.params;
            const result = await diaryService.findByTripId(trip_id);
            return res.status(result.status).json(result)
        } catch (err) {
            next(err);
        }
    }

    // POST - /diaries
    async createDiary(req: Request, res: Response, next: NextFunction) {
        try {
            const diary = req.body;

            console.log(diary);
            const result = await diaryService.createOne(diary);
            return res.status(result.status).json(result)

        } catch (err) {
            next(err);
        }
    }

    // PATCH - /diaries/:id
    async updateDiaryById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const diary = req.body;
            const result = await diaryService.updateById(id, diary);
            return res.status(result.status).json(result)
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /diaries/:id
    async deleteDiaryById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await diaryService.deleteById(id);
            return res.status(result.status).json(result)
        } catch (err) {
            next(err);
        }
    }
}

export const diaryController = new DiaryController();
