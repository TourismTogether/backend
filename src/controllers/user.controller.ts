import { Request, Response, NextFunction } from "express";
import userSevice from "../services/user.service";
import { IUser } from "../models/user.model";

class UserController {
    // GET - /users
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userSevice.findAll();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }
}


export default new UserController();