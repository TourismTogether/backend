import { Request, Response, NextFunction } from "express";
import aiRoutePlannerService from "../services/aiRoutePlanner.service";
import OpenAI from "openai";
import config from "../configs/config";

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

  async generateDiary(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic, goal, audience } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Missing topic" });
      }

      const result = await aiRoutePlannerService.generateDiary({
        topic,
        audience: audience || "Người mới",
        goal: goal || "Chia sẻ trải nghiệm cá nhân",
      });

      res.json({ result });
    } catch (err) {
      next(err);
    }
  }

  async generateForum(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Missing topic" });
      }

      const result = await aiRoutePlannerService.generateForum({
        topic
      });

      res.json({ result });
    } catch (err) {
      next(err);
    }
  }
}

export default new AIRoutePlannerController();

