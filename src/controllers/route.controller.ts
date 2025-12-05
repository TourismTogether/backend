import { Request, Response, NextFunction } from "express"
import routeService from "../services/route.service";
import { IRoute } from "../models/route.model";
import { APIResponse } from "../types/response";

class RouteController {
    // GET - /routes
    async getAllRoutes(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await routeService.findAll();
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /routes/:id
    async getRouteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await routeService.findById(id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /routes/:id/costs
    async getListCost(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await routeService.findListCost(id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /routes
    async createRoute(req: Request, res: Response, next: NextFunction) {
        try {
            const route: IRoute = req.body;
            const result = await routeService.createOne(route);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /routes/:id
    async updateRoute(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const route = req.body;
            const result = await routeService.updateById(id, route);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /routes/:id
    async deleteRoute(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await routeService.deleteById(id);
            res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new RouteController();