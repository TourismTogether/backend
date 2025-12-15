import { Request, Response, NextFunction } from "express";
import assessTripService from "../services/assessTrip.service";

class AssessTripController {

    async getByTrip(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await assessTripService.getByTrip(req.params.tripId);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await assessTripService.createOne(req.body);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await assessTripService.updateOne(req.body);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { traveller_id, trip_id } = req.body;
            const result = await assessTripService.deleteOne(traveller_id, trip_id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new AssessTripController();
