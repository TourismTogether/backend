import { NextFunction, Request, Response } from "express";
import adminService from "../services/admin.service";

class AdminController {
  async getAllAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.findAll();
      return res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getAdminById(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const result = await adminService.findById(user_id);
      return res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await adminService.createOne(req.body);
      return res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  async updateAdminById(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params;
      const result = await adminService.updateById(user_id, req.body);
      return res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

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
