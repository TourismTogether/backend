import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user.model";
import authService from "../services/auth.service";
import { accountModel, IAccount } from "../models/account.model";
import { ISession } from "../types/session";
import { STATUS } from "../types/response";
import passport from "../configs/passport";

class AuthController {
    // POST - /auth/signup
    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password, full_name, avatar_url, phone } = req.body;
            const account = { username, email, password };
            // Use full_name if provided, otherwise use username as fallback
            const user = {
                full_name: full_name || username || "User",
                avatar_url: avatar_url || "",
                phone: phone || ""
            };
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
        passport.authenticate(
            "local",
            (err: any, user: any, info?: { message?: string }) => {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    return res.status(401).json({
                        status: 401,
                        message: info?.message || "Login failed",
                    });
                }

                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }

                    return res.status(200).json({
                        status: 200,
                        message: "Login success",
                        data: user,
                    });
                });
            }
        )(req, res, next);
    }

    // GET - /auth/user
    async getCurUser(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.isAuthenticated()) {
                return res.status(STATUS.OK).json({
                    status: STATUS.OK,
                    message: "Not authenticated",
                    data: {
                        isAuthenticated: false,
                    },
                });
            }

            const user = req.user as { account_id?: string };

            let account: IAccount | undefined;
            if (user?.account_id) {
                account = await accountModel.findById(user.account_id);
            }

            return res.status(STATUS.OK).json({
                status: STATUS.OK,
                message: "Successfully",
                data: {
                    isAuthenticated: true,
                    user,
                    account,
                },
            });
        } catch (err) {
            next(err);
        }
    }

    // POST - /auth/logout
    async logOut(req: Request, res: Response, next: NextFunction) {
        try {
            req.logout(function (err) {
                if (err) { return next(err); }
                return res.status(200).json({
                    status: STATUS.OK,
                    message: "Successfully"
                })
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();