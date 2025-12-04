import { Request, Response, NextFunction } from "express";
import costService from "../services/cost.service";

class CostController {
    // GET - /costs
    async getAllCost(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await costService.findAll();
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /cost/:id
    async getCostById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await costService.findById(id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /costs
    async createCost(req: Request, res: Response, next: NextFunction) {
        try {
            const cost = req.body;
            const result = await costService.createOne(cost);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /costs/:id
    async updateCostById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const cost = req.body;
            const result = await costService.updateById(id, cost);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /costs/:id
    async deleteCostById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await costService.deleteById(id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new CostController();