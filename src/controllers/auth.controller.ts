import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { STATUS } from "../types/response";
import { signJwt } from "../utils/jwt";
import config from "../configs/config";
import userSevice from "../services/user.service";
import accountService from "../services/account.service";

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
            if (result.status != STATUS.OK) {
                return res.status(result.status).json(result);
            }

            const userId = result.data?.user?.id;
            if (!userId) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    status: STATUS.INTERNAL_SERVER_ERROR,
                    message: "Failed to create session",
                    error: true
                });
            }
            const token = signJwt(userId);

            res.cookie("token", token, {
                httpOnly: true,
                secure: config.nodeEnv !== "Development",
                sameSite: config.nodeEnv === "Development" ? "lax" : "none",
                maxAge: 3600 * 1000
            });

            res.json({
                status: 200
            });
        } catch (err) {
            next(err);
        }
    }

    // POST - /auth/signin
    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, username } = req.body;
            const result = await authService.signIn({ email, password, username });
            if (result.status != STATUS.OK) {
                return res.status(result.status).json(result);
            }

            const userId = result.data?.user?.id;
            if (!userId) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                    status: STATUS.INTERNAL_SERVER_ERROR,
                    message: "Failed to create session",
                    error: true
                });
            }
            const token = signJwt(userId);

            res.cookie("token", token, {
                httpOnly: true,
                secure: config.nodeEnv !== "Development",
                sameSite: config.nodeEnv === "Development" ? "lax" : "none",
                maxAge: 3600 * 1000
            });

            res.json({
                status: 200
            });
        } catch (err) {
            next(err);
        }
    }

    // GET - /auth/user (optional auth: no cookie → 200 + isAuthenticated false, avoids noisy 401 on public pages)
    async getCurUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(STATUS.OK).json({
                    status: STATUS.OK,
                    message: "Not authenticated",
                    data: {
                        isAuthenticated: false,
                        user: null,
                        account: null
                    }
                });
            }
            const { data: user }: any = await userSevice.findById(userId);

            if (!user) {
                return res.status(STATUS.UNAUTHORIZED).json({
                    status: STATUS.UNAUTHORIZED,
                    message: "Unauthorized"
                });
            }

            const { data: account }: any = await accountService.findById(user.account_id);

            if (!account) {
                return res.status(STATUS.UNAUTHORIZED).json({
                    status: STATUS.UNAUTHORIZED,
                    message: "Unauthorized"
                });
            }

            res.status(STATUS.OK).json({
                status: STATUS.OK,
                message: "Successfully",
                data: {
                    isAuthenticated: true,
                    user,
                    account
                }
            });
        } catch (err) {
            next(err);
        }
    }

    // POST - /auth/logout
    async logOut(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: config.nodeEnv !== "Development",
                sameSite: config.nodeEnv === "Development" ? "lax" : "none",
            });
            return res.status(200).json({
                status: STATUS.OK,
                message: "Successfully"
            })
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();