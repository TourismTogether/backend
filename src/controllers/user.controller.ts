import { Request, Response, NextFunction } from "express";
import userSevice from "../services/user.service";
import { IUser } from "../models/user.model";

class UserController {
    // GET - /users
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userSevice.findAll();
            return res.json(users);
        } catch (err) {
            next(err);
        }
    }

    // GET - /users/:id
    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await userSevice.findById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /users/:id/trips
    async getListTrip(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await userSevice.findListTrip(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /users
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.body;
            const result = await userSevice.createOne(user);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /users/:id
    async updateUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = req.body;
            const result = await userSevice.updateById(id, user);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /users/:id
    async deleteUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await userSevice.deleteById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}


export default new UserController();