import { Request, Response, NextFunction } from "express";
import travellerService from "../services/traveller.service";

class TravellerController {
    // GET - /travellers
    async getAllTraveller(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await travellerService.findAll();
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /travellers/:user_id
    async getTravellerById(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const result = await travellerService.findById(user_id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /travellers
    async createTraveller(req: Request, res: Response, next: NextFunction) {
        try {
            const traveller = req.body;
            const result = await travellerService.createOne(traveller);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /travellers/:user_id
    async updateTravellerById(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const traveller = req.body
            const result = await travellerService.updateById(user_id, traveller);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /travellers/:user_id
    async deleteTravellerById(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const result = await travellerService.deleteById(user_id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new TravellerController();