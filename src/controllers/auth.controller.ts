import { Request, Response, NextFunction } from "express";
import authService from "../services/auth.service";
import { STATUS } from "../types/response";
import { base64url } from "../utils/jwt";
import crypto from "crypto";
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

            const header = {
                alg: "HS256",
                typ: "JWT"
            }

            const payload = {
                userId: result.data?.user.id,
                expireAt: Date.now() + (3600 * 1000) // 1h
            }

            const encodedHeader = base64url(JSON.stringify(header));
            const encodedPayload = base64url(JSON.stringify(payload));

            const tokenData = `${encodedHeader}.${encodedPayload}`;

            const hmac = crypto.createHmac("sha256", config.secretKey);
            const signature = hmac.update(tokenData).digest("base64url");

            const token = `${tokenData}.${signature}`;

            res.cookie("token", token, {
                httpOnly: true,
                secure: config.nodeEnv == "Development" ? false : true,
                sameSite: config.nodeEnv == "Development" ? "lax" : "none",
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

            const header = {
                alg: "HS256",
                typ: "JWT"
            }

            const payload = {
                userId: result.data?.user.id,
                expireAt: Date.now() + (3600 * 1000) // 1h
            }

            const encodedHeader = base64url(JSON.stringify(header));
            const encodedPayload = base64url(JSON.stringify(payload));

            const tokenData = `${encodedHeader}.${encodedPayload}`;

            const hmac = crypto.createHmac("sha256", config.secretKey);
            const signature = hmac.update(tokenData).digest("base64url");

            const token = `${tokenData}.${signature}`;

            res.cookie("token", token, {
                httpOnly: true,
                secure: config.nodeEnv == "Development" ? false : true,
                sameSite: config.nodeEnv == "Development" ? "lax" : "none",
                maxAge: 3600 * 1000
            });

            res.json({
                status: 200
            });
        } catch (err) {
            next(err);
        }
    }

    // GET - /auth/user
    async getCurUser(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token;

            const [encodedHeader, encodedPayload, tokenSignature] = token.split(".");
            const tokenData = `${encodedHeader}.${encodedPayload}`;
            const hmac = crypto.createHmac("sha256", config.secretKey);
            const signature = hmac.update(tokenData).digest("base64url");

            if (signature != tokenSignature) {
                return res.status(STATUS.UNAUTHORIZED).json({
                    status: STATUS.UNAUTHORIZED,
                    message: "Unauthorized"
                });
            }


            const payload = JSON.parse(atob(encodedPayload));
            const { data: user }: any = await userSevice.findById(payload.userId);

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
                secure: config.nodeEnv == "Development" ? false : true,
                sameSite: config.nodeEnv == "Development" ? "lax" : "none",
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