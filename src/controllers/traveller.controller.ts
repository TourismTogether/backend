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
            if (!user_id || user_id === "NaN" || user_id === "undefined" || user_id.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    message: "User ID is required and must be a valid UUID",
                    error: true,
                });
            }
            // Validate UUID format (basic check)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(user_id)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid User ID format. Expected UUID.",
                    error: true,
                });
            }
            const result = await travellerService.findById(user_id);
            return res.status(result.status).json(result);
        } catch (err: unknown) {
            console.error("Error in getTravellerById:", err);
            next(err);
        }
    }

    // GET - /travellers/:user_id/diaries
    async getListDiaries(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const result = await travellerService.getListDiaries(user_id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /travellers/:user_id/posts
    async getListPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const result = await travellerService.getListPosts(user_id);
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

    // GET - /travellers/sos/supporter/:supporter_id
    async getSOSBySupporterId(req: Request, res: Response, next: NextFunction) {
        try {
            const { supporter_id } = req.params;
            const result = await travellerService.findSOSBySupporterId(supporter_id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /travellers/sos/all (Admin only)
    async getAllSOS(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await travellerService.findAllSOS();
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new TravellerController();