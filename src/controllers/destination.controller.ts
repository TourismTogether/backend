import { Request, Response, NextFunction } from "express";
import destinationService from "../services/destination.service";

class DestinationController {
    // GET - /destinations
    async getAllDestination(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await destinationService.findAll();
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /destinations/:id
    async getDestinationById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await destinationService.findById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /destiantions
    async createDestination(req: Request, res: Response, next: NextFunction) {
        try {
            const destiantion = req.body;
            const result = await destinationService.createOne(destiantion);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /destinations/:id
    async updateDestinationById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const destiantion = req.body;
            const result = await destinationService.updateById(id, destiantion);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /destinations/:id
    async deleteDestinationById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await destinationService.deleteById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new DestinationController();