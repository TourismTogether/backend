import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import config from "../configs/config";
import { UnauthorizedError } from "./error-handler";

// Extend Express Request to include user
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
 * Authentication middleware to verify JWT token from cookies
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new UnauthorizedError("No authentication token provided");
    }

    // Verify token format
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new UnauthorizedError("Invalid token format");
    }

    const [encodedHeader, encodedPayload, tokenSignature] = parts;

    // Verify signature
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = crypto.createHmac("sha256", config.secretKey);
    const signature = hmac.update(tokenData).digest("base64url");

    if (signature !== tokenSignature) {
      throw new UnauthorizedError("Invalid token signature");
    }

    // Decode and verify payload
    let payload: any;
    try {
      payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
    } catch (decodeError) {
      throw new UnauthorizedError("Invalid token payload");
    }

    // Check token expiration
    if (payload.expireAt && Date.now() > payload.expireAt) {
      throw new UnauthorizedError("Token has expired");
    }

    // Attach user info to request
    if (payload.userId) {
      req.userId = payload.userId;
      req.user = { id: payload.userId };
    } else {
      throw new UnauthorizedError("Token missing user ID");
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication - doesn't fail if no token, but attaches user if token is valid
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(); // Continue without authentication
    }

    // Verify token format
    const parts = token.split(".");
    if (parts.length !== 3) {
      return next(); // Invalid format, continue without auth
    }

    const [encodedHeader, encodedPayload, tokenSignature] = parts;

    // Verify signature
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = crypto.createHmac("sha256", config.secretKey);
    const signature = hmac.update(tokenData).digest("base64url");

    if (signature !== tokenSignature) {
      return next(); // Invalid signature, continue without auth
    }

    // Decode payload
    try {
      const payload = JSON.parse(
        Buffer.from(encodedPayload, "base64url").toString()
      );

      // Check expiration
      if (payload.expireAt && Date.now() > payload.expireAt) {
        return next(); // Expired, continue without auth
      }

      // Attach user info if valid
      if (payload.userId) {
        req.userId = payload.userId;
        req.user = { id: payload.userId };
      }
    } catch (error) {
      // Ignore decode errors, continue without auth
    }

    next();
  } catch (error) {
    next(); // Continue even on error
  }
}
