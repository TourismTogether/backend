import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
import { UnauthorizedError } from "./error-handler";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
      };
    }
  }
}

/**
 * Authentication middleware: verify JWT from cookie (constant-time verification).
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedError("No authentication token provided");
    }

    const payload = verifyJwt(token);
    if (!payload) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    req.userId = payload.userId;
    req.user = { id: payload.userId };
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication: attach user if valid token present; does not fail if missing/invalid.
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.token;
    if (!token) return next();

    const payload = verifyJwt(token);
    if (!payload) return next();

    req.userId = payload.userId;
    req.user = { id: payload.userId };
    next();
  } catch {
    next();
  }
}
