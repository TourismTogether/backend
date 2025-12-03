import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import authService from "../services/auth.service";
import { IAccount } from "../models/account.model";

class AuthController {
    // POST - /auth/signup
    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password, full_name, avatar_url, phone } = req.body;
            const account = { username, email, password };
            const user = { full_name, avatar_url, phone };
            const result = await authService.signUp(account, user);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /auth/signin
    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;
            const account = { username, email, password };
            const result = await authService.signIn(account);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();