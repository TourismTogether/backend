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
            if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    message: "User ID is required and must be a valid UUID",
                    error: true,
                });
            }
            // Validate UUID format (basic check)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid User ID format. Expected UUID.",
                    error: true,
                });
            }
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
            if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    message: "User ID is required and must be a valid UUID",
                    error: true,
                });
            }
            // Validate UUID format (basic check)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid User ID format. Expected UUID.",
                    error: true,
                });
            }
            const result = await userSevice.findListTrip(id);
            return res.status(result.status).json(result);
        } catch (err: unknown) {
            console.error("Error in getListTrip:", err);
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
            if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    message: "User ID is required and must be a valid UUID",
                    error: true,
                });
            }
            // Validate UUID format (basic check)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid User ID format. Expected UUID.",
                    error: true,
                });
            }
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
            if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    message: "User ID is required and must be a valid UUID",
                    error: true,
                });
            }
            // Validate UUID format (basic check)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid User ID format. Expected UUID.",
                    error: true,
                });
            }
            const result = await userSevice.deleteById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}


export default new UserController();