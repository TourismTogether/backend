import { error } from "console";
import { ITrip, tripModel } from "../models/trip.model";
import { APIResponse, STATUS } from "../types/response";

const tripService = {
    async findAll(): Promise<APIResponse<Array<ITrip>>> {
        const trips = await tripModel.findAll();
        if (!trips) {
            return {
                status: STATUS.NOT_FOUND,
                message: "",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: trips
        }
    },

    async findById(id: string | undefined): Promise<APIResponse<ITrip>> {
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
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to find trip",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: trip
        };
    },

    async createOne(trip: ITrip): Promise<APIResponse<ITrip>> {
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
    }
};

export default tripService;