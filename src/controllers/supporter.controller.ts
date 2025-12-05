import { Request, Response, NextFunction } from "express";
import supporterService from "../services/supporter.service";

class SupporterController {
    // GET - /supporters
    async getAllSupporters(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await supporterService.findAll();
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /supporters/:user_id
    async getSupporterById(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const result = await supporterService.findById(user_id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /supporters
    async createSupporter(req: Request, res: Response, next: NextFunction) {
        try {
            const supporter = req.body;
            const result = await supporterService.createOne(supporter);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /supporters/:user_id
    async updateSupporterById(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const supporter = req.body
            const result = await supporterService.updateById(user_id, supporter);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /supporters/:user_id
    async deleteSupporterById(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const result = await supporterService.deleteById(user_id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new SupporterController();