import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import authService from "../services/auth.service";

class AuthController {
    // POST - /auth/signup
    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const newUser: IUser = req.body;
            const result = await authService.signUp(newUser);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();