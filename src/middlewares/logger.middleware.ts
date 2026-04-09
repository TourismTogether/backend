import { Request, Response, NextFunction } from "express";
import type { Response as ExpressResponse } from "express";

/**
 * Simple request logging middleware
 * Logs: method, url, status, response time, IP
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  // Log request
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`
  );

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  res.end = function (chunk?: any, encoding?: any, cb?: any): Response {
    const duration = Date.now() - startTime;
    const statusColor =
      res.statusCode >= 500
        ? "\x1b[31m" // Red
        : res.statusCode >= 400
        ? "\x1b[33m" // Yellow
        : res.statusCode >= 300
        ? "\x1b[36m" // Cyan
        : "\x1b[32m"; // Green

    console.log(
      `${statusColor}[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms\x1b[0m`
    );

    return originalEnd(chunk, encoding, cb);
  };

  next();
}

/**
 * Error logging middleware (should be used before error handler)
 */
export function errorLogger(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = (err as any)?.statusCode;
  const isClientError = Number.isFinite(statusCode) && statusCode >= 400 && statusCode < 500;
  const isValidationError = (err as any)?.code === "VALIDATION_ERROR" || err.message.startsWith("Validation failed:");

  const logPayload = {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    ...(isClientError || isValidationError ? {} : { stack: err.stack }),
  };

  if (isClientError || isValidationError) {
    console.warn(
      `[${new Date().toISOString()}] WARN: ${err.message}`,
      logPayload
    );
  } else {
    console.error(
      `[${new Date().toISOString()}] ERROR: ${err.message}`,
      logPayload
    );
  }
  next(err);
}
