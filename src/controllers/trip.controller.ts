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

    // GET - /trips/:id/users
    async getTripMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await tripService.findTripMembers(id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /trips/:id/routes
    async getListRoutes(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await tripService.findListRoutes(id);
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

    // POST - /trips/:trip_id/users/:user_id
    async addTripMember(req: Request, res: Response, next: NextFunction) {
        try {
            const { trip_id, user_id } = req.params;
            const result = await tripService.addTripMember(trip_id, user_id);
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

    // DELETE - /trips/:trip_id/users/:user_id
    async deleteTripMember(req: Request, res: Response, next: NextFunction) {
        try {
            const { trip_id, user_id } = req.params;
            const result = await tripService.deleteTripMember(trip_id, user_id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new TripController();