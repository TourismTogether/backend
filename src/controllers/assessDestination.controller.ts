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
      console.log("Request Body:", req.body);
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
      const { traveller_id, destination_id } = req.body;
      const result = await assessDestinationService.deleteOne(
        traveller_id,
        destination_id
      );
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default new AssessDestinationController();
