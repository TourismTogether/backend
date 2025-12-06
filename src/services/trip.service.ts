import { ITrip, tripModel } from "../models/trip.model";
import { APIResponse, STATUS } from "../types/response";
import { IUser, userModel } from "../models/user.model";
import { IJoinTrip, joinTripModel } from "../models/join-trip.model";
import { destinationModel, IDestination } from "../models/destination.model";
import { ITripResponse } from "../dto/tripResponse";
import { error } from "console";
import { IDiary } from "../models/diary.model";
import { IRoute } from "express";

const tripService = {
    async findAll(): Promise<APIResponse<Array<ITripResponse>>> {
        const trips = await tripModel.findAll();
        if (!trips || trips.length === 0) {
            return {
                status: STATUS.NOT_FOUND,
                message: "No trips found",
                error: true
            }
        }

        const responses = await Promise.all(
            trips.map(async (trip) => {
                const { destination_id, ...dataTrip } = trip;

                const destination = await destinationModel.findById(destination_id);
                if (!destination) return null;

                return {
                    ...dataTrip,
                    destination
                } as ITripResponse;
            })
        );

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: responses.filter(t => t !== null)
        }
    },

    async findById(id: string | undefined): Promise<APIResponse<ITripResponse>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            }
        }
        const trip = await tripModel.findById(id);
        if (!trip) {
            return {
                status: STATUS.NOT_FOUND,
                message: "id is not found",
                error: true
            };
        }
        const { destination_id, ...dataTrip } = trip
        const destination = await destinationModel.findById(destination_id);
        if (!destination) {
            return {
                status: STATUS.NOT_FOUND,
                message: "destination_id is not found",
                error: true
            };
        }
        const result = {
            ...dataTrip,
            destination
        };
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: result
        };
    },

    async createOne(trip: ITrip): Promise<APIResponse<ITrip>> {
        if (!trip.destination_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "destination_id is requied",
                error: true
            }
        }
        const description = await destinationModel.findById(trip.destination_id);
        if (!description) {
            return {
                status: STATUS.NOT_FOUND,
                message: "destination_id is not found",
                error: true
            }
        }

        trip.created_at = new Date(Date.now());
        trip.updated_at = new Date(Date.now());

        const newtrip = await tripModel.createOne(trip);
        if (!newtrip) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create trip",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newtrip
        };
    },

    async updateById(id: string | undefined, trip: ITrip): Promise<APIResponse<ITrip>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }
        trip.updated_at = new Date(Date.now());
        const updatedtrip = await tripModel.updateById(id, trip);
        if (!updatedtrip) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update trip",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updatedtrip
        };
    },

    async deleteById(id: string | undefined): Promise<APIResponse<ITrip>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }
        const result = tripModel.deleteById(id);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to delete trip",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully"
        }
    },

    async findTripMembers(id: string | undefined): Promise<APIResponse<Array<IUser>>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            }
        }
        const trip = await tripModel.findById(id);
        if (!trip) {
            return {
                status: STATUS.NOT_FOUND,
                message: "id is not found",
                error: true
            };
        }
        const tripMembers = await tripModel.findTripMembers(id);
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: tripMembers
        }
    },

    async addTripMember(trip_id: string | undefined, user_id: string | undefined): Promise<APIResponse<IJoinTrip>> {
        if (!trip_id || !user_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "trip_id and user_id is require",
                error: true
            }
        }
        const trip = await tripModel.findById(trip_id);
        if (!trip) {
            return {
                status: STATUS.NOT_FOUND,
                message: "trip_id is not found",
                error: true
            };
        }
        const user = await userModel.findById(user_id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "user_id is not found",
                error: true
            };
        }
        const tripMember = await joinTripModel.find(user_id, trip_id);
        if (tripMember) {
            return {
                status: STATUS.CONFLICT,
                message: "trip member already exist"
            }
        }
        const joinTrip: IJoinTrip = { trip_id, user_id, created_at: new Date(Date.now()) };
        const newJoinTrip = await joinTripModel.create(joinTrip);
        if (!newJoinTrip) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "failed to add member",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newJoinTrip
        }
    },

    async deleteTripMember(trip_id: string | undefined, user_id: string | undefined) {
        if (!trip_id || !user_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "trip_id and user_id is require",
                error: true
            }
        }
        const trip = await tripModel.findById(trip_id);
        if (!trip) {
            return {
                status: STATUS.NOT_FOUND,
                message: "trip_id is not found",
                error: true
            };
        }
        const user = await userModel.findById(user_id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "user_id is not found",
                error: true
            };
        }
        const result = await joinTripModel.delete(user_id, trip_id);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "falied to delete",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully"
        }
    },

    async findListRoutes(id: string | undefined): Promise<APIResponse<Array<IRoute>>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is require",
                error: true
            }
        }
        const listRoutes = await tripModel.findListRoutes(id);
        if (!listRoutes) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "failed to find"
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: listRoutes
        }
    },

    async findListDiaries(id: string | undefined): Promise<APIResponse<Array<IDiary>>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is require",
                error: true
            }
        }
        const listDiaries = await tripModel.findListDiaries(id);
        if (!listDiaries) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "failed to find"
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: listDiaries
        }
    }
};

export default tripService;