import { Request, Response, NextFunction } from "express";
import aiRoutePlannerService from "../services/aiRoutePlanner.service";

class AIRoutePlannerController {
  async generateItinerary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await aiRoutePlannerService.generateItinerary(req.body);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default new AIRoutePlannerController();

