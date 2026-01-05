import { Request, Response, NextFunction } from "express"
import regionService from "../services/region.service";

class RegionController {
    // GET - /regions
    async getAllRegion(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await regionService.findAll();
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /regions
    async createRegion(req: Request, res: Response, next: NextFunction) {
        try {
            const region = req.body;
            const result = await regionService.createOne(region);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /regions/:id
    async updateRegionById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const region = req.body;
            const result = await regionService.updateById(id, region);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /regions/:id
    async deleteRegionById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await regionService.deleteById(id);
            return res.status(result.status).json(result);
        } catch (err: any) {
            // Handle foreign key constraint error
            if (err.code === '23503' || err.message?.includes('foreign key constraint')) {
                return res.status(400).json({
                    status: 400,
                    message: "Cannot delete region. It is being used by one or more destinations. Please remove or update those destinations first.",
                    error: true
                });
            }
            next(err);
        }
    }
}

export default new RegionController();