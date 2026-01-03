import { Request, Response, NextFunction } from "express";
import assessDestinationService from "../services/assessDestination.service";

class AssessDestinationController {
  async getByDestination(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await assessDestinationService.getByDestination(
        req.params.destinationId
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await assessDestinationService.createOne(req.body);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await assessDestinationService.updateOne(req.body);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { traveller_id, destination_id, no } = req.body;

      if (!traveller_id || !destination_id || no == null) {
        return res.status(400).json({
          status: 400,
          message: "Missing required fields: traveller_id, destination_id, no",
          error: true,
        });
      }

      const result = await assessDestinationService.deleteOne(
        traveller_id,
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
