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
            const result = await adminService.findById(user_id);
            return res.status(result.status).json(result);
        } catch (err) {
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