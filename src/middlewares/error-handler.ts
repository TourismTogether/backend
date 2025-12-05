import { Request, Response, NextFunction } from "express";
import { APIResponse } from "../types/response";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err.stack);

    res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: err,
        error: true
    })
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
        status: 404,
        message: "Not found route",
        error: true
    })
}
