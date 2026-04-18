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

/**
 * Avoid 304 + stale JSON for GET /auth/user (browser could reuse a cached guest session after sign-in).
 */
export function noCacheAuthUser(req: Request, res: Response, next: NextFunction) {
  delete req.headers["if-none-match"];
  delete req.headers["if-modified-since"];
  res.setHeader(
    "Cache-Control",
    "private, no-store, no-cache, must-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}
