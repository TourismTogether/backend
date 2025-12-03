import { Request, Response, NextFunction } from "express";
import tripService from "../services/trip.service";

class TripController {
    // GET - /trips
    async getAllTrips(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await tripService.findAll();
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /trips/:id
    async getTripById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await tripService.findById(id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /trips
    async createTrip(req: Request, res: Response, next: NextFunction) {
        try {
            const trip = req.body;
            const result = await tripService.createOne(trip);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /trips/:id
    async updateTripById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const trip = req.body;
            const result = await tripService.updateById(id, trip);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /trips/:id
    async deleteTripById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await tripService.deleteById(id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new TripController();