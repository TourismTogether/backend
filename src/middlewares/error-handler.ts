import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../types/response";
import { STATUS } from "../types/response";

// Custom error classes for better error handling
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string | undefined;

  constructor(message: string, statusCode: number = 500, code?: string | undefined) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, STATUS.BAD_REQUEST, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", code?: string) {
    super(message, STATUS.NOT_FOUND, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", code?: string) {
    super(message, STATUS.UNAUTHORIZED, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", code?: string) {
    super(message, STATUS.FORBIDDEN, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code?: string) {
    super(message, STATUS.CONFLICT, code);
  }
}

// Enhanced error handler
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error with context
  const errorContext = {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    timestamp: new Date().toISOString(),
  };

  // Log operational errors at warn level, programming errors at error level
  if (err instanceof AppError && err.isOperational) {
    const isClientError = err.statusCode >= 400 && err.statusCode < 500;
    // Reduce noise for expected client-side errors (validation, bad input, etc.).
    if (isClientError) {
      const { stack, ...safeContext } = errorContext;
      console.warn("Operational Error:", safeContext);
    } else {
      console.warn("Operational Error:", errorContext);
    }
  } else {
    console.error("Programming Error:", errorContext);
  }

  // Handle known error types
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      error: true,
      code: err.code,
      ...(err.code === "VALIDATION_ERROR" && { details: (err as any).details }),
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    } as APIResponse<null>);
  }

  // Handle database errors
  if ((err as any).code) {
    const dbError = err as any;
    
    // PostgreSQL error codes
    switch (dbError.code) {
      case "23505": // Unique violation
        return res.status(STATUS.CONFLICT).json({
          status: STATUS.CONFLICT,
          message: "Duplicate entry. This resource already exists.",
          error: true,
          code: "DUPLICATE_ENTRY",
        } as APIResponse<null>);
      
      case "23503": // Foreign key violation
        return res.status(STATUS.BAD_REQUEST).json({
          status: STATUS.BAD_REQUEST,
          message: "Invalid reference. Related resource does not exist.",
          error: true,
          code: "FOREIGN_KEY_VIOLATION",
        } as APIResponse<null>);
      
      case "23502": // Not null violation
        return res.status(STATUS.BAD_REQUEST).json({
          status: STATUS.BAD_REQUEST,
          message: "Missing required field.",
          error: true,
          code: "NOT_NULL_VIOLATION",
        } as APIResponse<null>);
      
      case "42P01": // Undefined table
      case "42P02": // Undefined parameter
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
          status: STATUS.INTERNAL_SERVER_ERROR,
          message: "Database configuration error. Please contact support.",
          error: true,
          code: "DATABASE_ERROR",
        } as APIResponse<null>);

      case "XX000": // Internal error from pooler/DB proxy (e.g., max clients)
        if (
          dbError?.message?.includes("MaxClientsInSessionMode") ||
          dbError?.message?.includes("max clients")
        ) {
          return res.status(STATUS.SERVICE_UNAVAILABLE).json({
            status: STATUS.SERVICE_UNAVAILABLE,
            message: "Database is temporarily busy. Please try again.",
            error: true,
            code: "DB_MAX_CLIENTS_REACHED",
          } as APIResponse<null>);
        }
        break;
    }
  }

  // Handle ValidationError (from our custom error handler)
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      error: true,
      code: err.code || "VALIDATION_ERROR",
    } as APIResponse<null>);
  }

  // Default error response
  const statusCode = (err as any).statusCode || STATUS.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    status: statusCode,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    error: true,
    code: "INTERNAL_ERROR",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  } as APIResponse<null>);
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const message =
    process.env.NODE_ENV === "production"
      ? "Not found"
      : `Route ${req.method} ${req.originalUrl} not found`;
  res.status(STATUS.NOT_FOUND).json({
    status: STATUS.NOT_FOUND,
    message,
    error: true,
    code: "ROUTE_NOT_FOUND",
  } as APIResponse<null>);
}
