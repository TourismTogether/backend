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
            if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    message: "Destination ID is required and must be a valid UUID",
                    error: true,
                });
            }
            // Validate UUID format (basic check)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid Destination ID format. Expected UUID.",
                    error: true,
                });
            }
            const result = await destinationService.findById(id);
            return res.status(result.status).json(result);
        } catch (err: unknown) {
            console.error("Error in getDestinationById:", err);
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
            if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    message: "Destination ID is required and must be a valid UUID",
                    error: true,
                });
            }
            // Validate UUID format (basic check)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid Destination ID format. Expected UUID.",
                    error: true,
                });
            }
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
            if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    message: "Destination ID is required and must be a valid UUID",
                    error: true,
                });
            }
            // Validate UUID format (basic check)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid Destination ID format. Expected UUID.",
                    error: true,
                });
            }
            const result = await destinationService.deleteById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new DestinationController();