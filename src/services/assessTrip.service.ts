import { IAssessTrip, assessTripModel } from "../models/assessTrip.model";
import { APIResponse, STATUS } from "../types/response";

const assessTripService = {

    async getByTrip(tripId: string | undefined): Promise<APIResponse<IAssessTrip[]>> {
        if (!tripId) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "trip_id is undefined",
                error: true
            };
        }

        const data = await assessTripModel.findByTripId(tripId);

        return {
            status: STATUS.OK,
            message: "Successfully",
            data
        };
    },

    async createOne(assess: IAssessTrip): Promise<APIResponse<IAssessTrip>> {
        if (!assess.traveller_id || !assess.trip_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "missing traveller_id or trip_id",
                error: true
            };
        }

        assess.created_at = new Date();
        assess.updated_at = new Date();

        const result = await assessTripModel.createOne(assess);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "failed to create assess_trip",
                error: true
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: result
        };
    },

    async updateOne(assess: IAssessTrip): Promise<APIResponse<IAssessTrip>> {
        assess.updated_at = new Date();

        const result = await assessTripModel.updateOne(assess);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "failed to update assess_trip",
                error: true
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: result
        };
    },

    async deleteOne(travellerId: string | undefined, tripId: string | undefined): Promise<APIResponse<null>> {
        if (!travellerId || !tripId) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "missing traveller_id or trip_id",
                error: true
            };
        }

        const result = await assessTripModel.deleteOne(travellerId, tripId);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "failed to delete assess_trip",
                error: true
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully"
        };
    }
};

export default assessTripService;
