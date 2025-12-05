import { error } from "console";
import { diaryModel, IDiary } from "../models/diary.model";
import { APIResponse, STATUS } from "../types/response";
import { userModel } from "../models/user.model";
import { tripModel } from "../models/trip.model";

const diaryService = {
    async findAll(): Promise<APIResponse<Array<IDiary>>> {
        const diaries = await diaryModel.findAll();
        if (!diaries) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Failed to find",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: diaries
        }
    },

    async findById(id: string | undefined): Promise<APIResponse<IDiary>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            }
        }
        const diary = await diaryModel.findById(id);
        if (!diary) {
            return {
                status: STATUS.NOT_FOUND,
                message: "not found diary"
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: diary
        }
    },

    async findByTripId(trip_id: string | undefined): Promise<APIResponse<Array<IDiary>>> {
        if (!trip_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "trip_id is undefined",
                error: true
            }
        }
        const diaries = await diaryModel.findByTrip(trip_id);
        if (!diaries) {
            return {
                status: STATUS.NOT_FOUND,
                message: "not found diary"
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: diaries
        }
    },

    async createOne(diary: IDiary): Promise<APIResponse<IDiary>> {
        if (!diary.user_id || !diary.trip_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id or trip_id is undefined",
                error: true
            }
        }
        const user = await userModel.findById(diary.user_id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "user_id is not found",
                error: true
            }
        }
        const trip = await tripModel.findById(diary.trip_id);
        if (!trip) {
            return {
                status: STATUS.NOT_FOUND,
                message: "trip_id is not found",
                error: true
            }
        }

        diary.created_at = new Date(Date.now());
        diary.updated_at = new Date(Date.now());
        const newDiary = await diaryModel.createOne(diary);
        if (!newDiary) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create diary",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newDiary
        }

    },

    async updateById(id: string | undefined, diary: IDiary): Promise<APIResponse<IDiary>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            }
        }
        const updatedDiary = await diaryModel.updateById(id, diary);
        if (!updatedDiary) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update diary",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updatedDiary
        }
    },

    async deleteById(id: string | undefined): Promise<APIResponse<IDiary>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            }
        }
        const result = await diaryModel.deleteById(id);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to delete diary",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully"
        }
    }
};

export default diaryService;
