import { Request, Response, NextFunction } from "express";
import tripService from "../services/trip.service";
import crypto from "crypto";
import config from "../configs/config";
import userService from "../services/user.service";

class TripController {
  // GET - /trips
  async getAllTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await tripService.findAll();
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  // GET - /trips/:id
  async getTripById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await tripService.findById(id);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  // GET - /trips/:id/users
  async getTripMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await tripService.findTripMembers(id);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  // GET - /trips/:id/routes
  async getListRoutes(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
        return res.status(400).json({
          status: 400,
          message: "Trip ID is required and must be a valid UUID",
          error: true,
        });
      }
      // Validate UUID format (basic check)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({
          status: 400,
          message: "Invalid Trip ID format. Expected UUID.",
          error: true,
        });
      }
      const result = await tripService.findListRoutes(id);
      res.status(result.status).json(result);
    } catch (err: unknown) {
      console.error("Error in getListRoutes:", err);
      next(err);
    }
  }

  // GET - /trips/:id/diaries
  async getListDiaries(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await tripService.findListDiaries(id);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  // POST - /trips
  async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const trip = req.body;
      const result = await tripService.createOne(trip);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  // POST - /trips/:trip_id/users/:user_id
  async addTripMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { trip_id, user_id } = req.params;
      const result = await tripService.addTripMember(trip_id, user_id);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  // PATCH - /trips/:id
  async updateTripById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const trip = req.body;
      const result = await tripService.updateById(id, trip);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  // DELETE - /trips/:id
  async deleteTripById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // Validate trip ID
      if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
        return res.status(400).json({
          status: 400,
          message: "Trip ID is required and must be a valid UUID",
          error: true,
        });
      }
      
      // Validate UUID format (basic check)
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        return res.status(400).json({
          status: 400,
          message: "Invalid Trip ID format. Expected UUID.",
          error: true,
        });
      }
      
      const result = await tripService.deleteById(id);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  // DELETE - /trips/:trip_id/users/:user_id
  async deleteTripMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { trip_id, user_id } = req.params;
      
      // Validate trip_id and user_id
      if (!trip_id || trip_id === "NaN" || trip_id === "undefined" || trip_id.trim() === "") {
        return res.status(400).json({
          status: 400,
          message: "Trip ID is required and must be a valid UUID",
          error: true,
        });
      }
      
      if (!user_id || user_id === "NaN" || user_id === "undefined" || user_id.trim() === "") {
        return res.status(400).json({
          status: 400,
          message: "User ID is required and must be a valid UUID",
          error: true,
        });
      }
      
      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(trip_id)) {
        return res.status(400).json({
          status: 400,
          message: "Invalid Trip ID format. Expected UUID.",
          error: true,
        });
      }
      
      if (!uuidRegex.test(user_id)) {
        return res.status(400).json({
          status: 400,
          message: "Invalid User ID format. Expected UUID.",
          error: true,
        });
      }
      
      const result = await tripService.deleteTripMember(trip_id, user_id);
      res.status(result.status).json(result);
    } catch (err) {
      next(err);
    }
  }

  // POST - /trips/:id/join
  async joinTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      // Get user from token
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized - Please login first",
          error: true,
        });
      }

      try {
        const [encodedHeader, encodedPayload, tokenSignature] = token.split(".");
        const tokenData = `${encodedHeader}.${encodedPayload}`;
        const hmac = crypto.createHmac("sha256", config.secretKey);
        const signature = hmac.update(tokenData).digest("base64url");

        if (signature !== tokenSignature) {
          return res.status(401).json({
            status: 401,
            message: "Unauthorized - Invalid token",
            error: true,
          });
        }

        const payload = JSON.parse(atob(encodedPayload));
        const userId = payload.userId;

        if (!userId) {
          return res.status(401).json({
            status: 401,
            message: "Unauthorized - Invalid token payload",
            error: true,
          });
        }

        const result = await tripService.joinTrip(id, userId, password);
        res.status(result.status).json(result);
      } catch (tokenError) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized - Invalid token format",
          error: true,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

export default new TripController();
