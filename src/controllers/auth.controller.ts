import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import authService from "../services/auth.service";
import { accountModel, IAccount } from "../models/account.model";
import { ISession } from "../types/session";
import { STATUS } from "../types/response";

class AuthController {
    // POST - /auth/signup
    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password, full_name, avatar_url, phone } = req.body;
            const account = { username, email, password };
            const user = { full_name, avatar_url, phone };
            const result = await authService.signUp(account, user);
            if (result.status == STATUS.OK && result.data) {
                (req.session as ISession).isAuthenticated = true;
                (req.session as ISession).user = result.data.user;
            }
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
            if (result.status == STATUS.OK && result.data) {
                (req.session as ISession).isAuthenticated = true;
                (req.session as ISession).user = result.data.user;
            }
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /auth/user
    async getCurUser(req: Request, res: Response, next: NextFunction) {
        try {
            const response: {
                isAuthenticated: boolean;
                user?: ISession["user"];
                account?: IAccount | undefined;
            } = {
                isAuthenticated: (req.session as ISession).isAuthenticated ?? false,
                user: (req.session as ISession).user
            };

            if (response.user && response.user.account_id) {
                const account = await accountModel.findById(response.user.account_id);
                response.account = account;
            }
            res.status(STATUS.OK).json({
                status: STATUS.OK,
                message: "Successfully",
                data: response
            });
        } catch (err) {
            next(err);
        }
    }

    // POST - /auth/logout
    async logOut(req: Request, res: Response, next: NextFunction) {
        try {
            (req.session as ISession).isAuthenticated = false;
            (req.session as ISession).user = null;
            res.status(STATUS.OK).json({
                status: STATUS.OK,
                message: "Successfully"
            })
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();