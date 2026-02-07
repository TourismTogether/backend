import { Request, Response, NextFunction } from "express";
import assessDestinationService from "../services/assessDestination.service";

class AssessDestinationController {
  async getByDestination(req: Request, res: Response, next: NextFunction) {
    try {
      const { destinationId } = req.params;
      if (!destinationId || destinationId === "NaN" || destinationId === "undefined" || destinationId.trim() === "") {
        return res.status(400).json({
          status: 400,
          message: "Destination ID is required and must be a valid UUID",
          error: true,
        });
      }
      // Validate UUID format (basic check)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(destinationId)) {
        return res.status(400).json({
          status: 400,
          message: "Invalid Destination ID format. Expected UUID.",
          error: true,
        });
      }
      const result = await assessDestinationService.getByDestination(destinationId);
      res.status(result.status).json(result);
    } catch (err: unknown) {
      console.error("Error in getByDestination:", err);
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ status: 401, message: "Unauthorized", error: true });
      }
      const body = { ...req.body, traveller_id: userId };
      const result = await assessDestinationService.createOne(body);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ status: 401, message: "Unauthorized", error: true });
      }
      const body = { ...req.body, traveller_id: userId };
      const result = await assessDestinationService.updateOne(body);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ status: 401, message: "Unauthorized", error: true });
      }
      const { traveller_id, destination_id, no } = req.body;
      const effectiveTravellerId = traveller_id || userId;
      if (!destination_id || no == null) {
        return res.status(400).json({
          status: 400,
          message: "Missing required fields: destination_id, no",
          error: true,
        });
      }
      if (effectiveTravellerId !== userId) {
        return res.status(403).json({ status: 403, message: "Forbidden", error: true });
      }

      const result = await assessDestinationService.deleteOne(
        effectiveTravellerId,
        destination_id,
        no
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default new AssessDestinationController();
