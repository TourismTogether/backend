import { Request, Response, NextFunction } from "express";
import { adminService } from "../services/admin.service";

class AdminController {
    // GET - /admins
    async getAllAdmins(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adminService.findAll();
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /admins/:user_id
    async getAdminById(req: Request, res: Response, next: NextFunction) {
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
            const result = await adminService.findById(user_id);
            return res.status(result.status).json(result);
        } catch (err: unknown) {
            console.error("Error in getAdminById:", err);
            next(err);
        }
    }


    // POST - /admins
    async createAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const admin = req.body;
            const result = await adminService.createOne(admin);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }


    // PATCH - /admins/:user_id
    async updateAdminById(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const supporter = req.body
            const result = await adminService.updateById(user_id, supporter);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }


    // DELETE - /admins
    async deleteAdminById(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id } = req.params;
            const result = await adminService.deleteById(user_id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

}

export default new AdminController();