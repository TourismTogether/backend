import { ITrip, tripModel } from "../models/trip.model";
import { APIResponse, STATUS } from "../types/response";
import { IUser, userModel } from "../models/user.model";
import { IJoinTrip, joinTripModel } from "../models/join-trip.model";
import { destinationModel, IDestination } from "../models/destination.model";
import { ITripResponse } from "../dto/tripResponse";
import { error } from "console";
import { IDiary, diaryModel } from "../models/diary.model";
import { IRoute, routeModel } from "../models/route.model";
import { costModel } from "../models/cost.model";
import { assessTripModel } from "../models/assessTrip.model";

const tripService = {
  async findAll(): Promise<APIResponse<Array<ITripResponse>>> {
    const trips = await tripModel.findAll();
    if (!trips || trips.length === 0) {
      return {
        status: STATUS.NOT_FOUND,
        message: "No trips found",
        error: true,
      };
    }

    const responses = await Promise.all(
      trips.map(async (trip) => {
        const { destination_id, ...dataTrip } = trip;

        const destination = await destinationModel.findById(destination_id);
        if (!destination) return null;

        return {
          ...dataTrip,
          destination,
        } as ITripResponse;
      })
    );

    return {
      status: STATUS.OK,
      message: "Successfully",
      data: responses.filter((t): t is ITripResponse => t !== null),
    };
  },

  async findById(id: string | undefined): Promise<APIResponse<ITripResponse>> {
    if (!id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "id is undefined",
        error: true,
      };
    }
    const trip = await tripModel.findById(id);
    if (!trip) {
      return {
        status: STATUS.NOT_FOUND,
        message: "id is not found",
        error: true,
      };
    }
    const { destination_id, ...dataTrip } = trip;
    const destination = await destinationModel.findById(destination_id);
    if (!destination) {
      return {
        status: STATUS.NOT_FOUND,
        message: "destination_id is not found",
        error: true,
      };
    }
    const result = {
      ...dataTrip,
      destination,
    };
    return {
      status: STATUS.OK,
      message: "Successfully",
      data: result,
    };
  },

  async createOne(trip: ITrip): Promise<APIResponse<ITrip>> {
    if (!trip.destination_id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "destination_id is requied",
        error: true,
      };
    }
    const description = await destinationModel.findById(trip.destination_id);
    if (!description) {
      return {
        status: STATUS.NOT_FOUND,
        message: "destination_id is not found",
        error: true,
      };
    }

    trip.created_at = new Date(Date.now());
    trip.updated_at = new Date(Date.now());

    const newtrip = await tripModel.createOne(trip);
    if (!newtrip) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "Failed to create trip",
        error: true,
      };
    }
    return {
      status: STATUS.OK,
      message: "Successfully",
      data: newtrip,
    };
  },

  async updateById(
    id: string | undefined,
    trip: ITrip
  ): Promise<APIResponse<ITrip>> {
    if (!id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "id is undefined",
        error: true,
      };
    }
    trip.updated_at = new Date(Date.now());
    const updatedtrip = await tripModel.updateById(id, trip);
    if (!updatedtrip) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "Failed to update trip",
        error: true,
      };
    }
    return {
      status: STATUS.OK,
      message: "Successfully",
      data: updatedtrip,
    };
  },

  async deleteById(id: string | undefined): Promise<APIResponse<ITrip>> {
    if (!id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "id is undefined",
        error: true,
      };
    }

    try {
      // 1. Get all routes for this trip to delete their costs first
      const routes = await tripModel.findListRoutes(id);

      // 2. Delete costs for all routes of this trip
      if (routes && routes.length > 0) {
        for (const route of routes) {
          if (route.id) {
            await costModel.deleteByRouteId(route.id);
          }
        }
      }

      // 3. Delete all routes for this trip
      await routeModel.deleteByTripId(id);

      // 4. Delete all diaries for this trip
      await diaryModel.deleteByTripId(id);

      // 5. Delete all join_trip entries for this trip
      await joinTripModel.deleteByTripId(id);

      // 6. Delete all assess_trip entries for this trip
      await assessTripModel.deleteByTripId(id);

      // 7. Finally, delete the trip itself
      const result = await tripModel.deleteById(id);
      if (!result) {
        return {
          status: STATUS.INTERNAL_SERVER_ERROR,
          message: "Failed to delete trip",
          error: true,
        };
      }

      return {
        status: STATUS.OK,
        message: "Successfully",
      };
    } catch (error) {
      console.error("Error deleting trip and related records:", error);
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "Failed to delete trip",
        error: true,
      };
    }
  },

  async findTripMembers(
    id: string | undefined
  ): Promise<APIResponse<Array<IUser>>> {
    if (!id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "id is undefined",
        error: true,
      };
    }
    const trip = await tripModel.findById(id);
    if (!trip) {
      return {
        status: STATUS.NOT_FOUND,
        message: "id is not found",
        error: true,
      };
    }
    const tripMembers = await tripModel.findTripMembers(id);
    return {
      status: STATUS.OK,
      message: "Successfully",
      data: tripMembers,
    };
  },

  async addTripMember(
    trip_id: string | undefined,
    user_id: string | undefined
  ): Promise<APIResponse<IJoinTrip>> {
    if (!trip_id || !user_id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "trip_id and user_id is require",
        error: true,
      };
    }
    const trip = await tripModel.findById(trip_id);
    if (!trip) {
      return {
        status: STATUS.NOT_FOUND,
        message: "trip_id is not found",
        error: true,
      };
    }
    const user = await userModel.findById(user_id);
    if (!user) {
      return {
        status: STATUS.NOT_FOUND,
        message: "user_id is not found",
        error: true,
      };
    }
    const tripMember = await joinTripModel.find(user_id, trip_id);
    if (tripMember) {
      return {
        status: STATUS.CONFLICT,
        message: "trip member already exist",
      };
    }
    const joinTrip: IJoinTrip = {
      trip_id,
      user_id,
      created_at: new Date(Date.now()),
    };
    const newJoinTrip = await joinTripModel.create(joinTrip);
    if (!newJoinTrip) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "failed to add member",
        error: true,
      };
    }
    return {
      status: STATUS.OK,
      message: "Successfully",
      data: newJoinTrip,
    };
  },

  async joinTrip(
    trip_id: string | undefined,
    user_id: string | undefined,
    password: string | undefined
  ): Promise<APIResponse<IJoinTrip>> {
    if (!trip_id || !user_id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "trip_id and user_id is required",
        error: true,
      };
    }

    const trip = await tripModel.findById(trip_id);
    if (!trip) {
      return {
        status: STATUS.NOT_FOUND,
        message: "Trip không tồn tại",
        error: true,
      };
    }

    // Check if trip has password and validate it
    if (trip.password) {
      if (!password) {
        return {
          status: STATUS.BAD_REQUEST,
          message: "Mật khẩu là bắt buộc để tham gia chuyến đi này",
          error: true,
        };
      }
      // Simple password comparison (in production, use bcrypt)
      if (trip.password !== password) {
        return {
          status: STATUS.UNAUTHORIZED,
          message: "Mật khẩu không đúng",
          error: true,
        };
      }
    }

    const user = await userModel.findById(user_id);
    if (!user) {
      return {
        status: STATUS.NOT_FOUND,
        message: "User không tồn tại",
        error: true,
      };
    }

    // Check if user is already a member
    const tripMember = await joinTripModel.find(user_id, trip_id);
    if (tripMember) {
      return {
        status: STATUS.CONFLICT,
        message: "Bạn đã tham gia chuyến đi này rồi",
        error: true,
      };
    }

    const joinTrip: IJoinTrip = {
      trip_id,
      user_id,
      created_at: new Date(Date.now()),
    };
    const newJoinTrip = await joinTripModel.create(joinTrip);
    if (!newJoinTrip) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "Không thể tham gia chuyến đi",
        error: true,
      };
    }

    return {
      status: STATUS.OK,
      message: "Tham gia chuyến đi thành công",
      data: newJoinTrip,
    };
  },

  async deleteTripMember(
    trip_id: string | undefined,
    user_id: string | undefined
  ) {
    if (!trip_id || !user_id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "trip_id and user_id is require",
        error: true,
      };
    }
    const trip = await tripModel.findById(trip_id);
    if (!trip) {
      return {
        status: STATUS.NOT_FOUND,
        message: "trip_id is not found",
        error: true,
      };
    }
    const user = await userModel.findById(user_id);
    if (!user) {
      return {
        status: STATUS.NOT_FOUND,
        message: "user_id is not found",
        error: true,
      };
    }
    const result = await joinTripModel.delete(user_id, trip_id);
    if (!result) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "falied to delete",
        error: true,
      };
    }
    return {
      status: STATUS.OK,
      message: "Successfully",
    };
  },

  async findListRoutes(
    id: string | undefined
  ): Promise<APIResponse<Array<IRoute>>> {
    if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
      return {
        status: STATUS.BAD_REQUEST,
        message: "Trip ID is required and must be a valid UUID",
        error: true,
      };
    }
    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "Invalid Trip ID format. Expected UUID.",
        error: true,
      };
    }
    const listRoutes = await tripModel.findListRoutes(id);
    if (!listRoutes) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "failed to find",
      };
    }
    return {
      status: STATUS.OK,
      message: "Successfully",
      data: listRoutes,
    };
  },

  async findListDiaries(
    id: string | undefined
  ): Promise<APIResponse<Array<IDiary>>> {
    if (!id) {
      return {
        status: STATUS.BAD_REQUEST,
        message: "id is require",
        error: true,
      };
    }
    const listDiaries = await tripModel.findListDiaries(id);
    if (!listDiaries) {
      return {
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: "failed to find",
      };
    }
    return {
      status: STATUS.OK,
      message: "Successfully",
      data: listDiaries,
    };
  },
};

export default tripService;
