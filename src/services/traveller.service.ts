import { travellerModel, ITraveller } from "../models/traveller.model";
import { APIResponse, STATUS } from "../types/response";

const travellerService = {
    async findAll(): Promise<APIResponse<ITraveller[]>> {
        const travellers = await travellerModel.findAll();
        if (!travellers) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Failed to find"
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: travellers,
        };
    },

    async findById(id: string | undefined): Promise<APIResponse<ITraveller>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true,
            };
        }

        const traveller = await travellerModel.findById(id);
        if (!traveller) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Traveller not found",
                error: true,
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: traveller,
        };
    },

    async createOne(traveller: ITraveller): Promise<APIResponse<ITraveller>> {
        if (!traveller.user_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is required",
                error: true,
            };
        }

        const newTraveller = await travellerModel.createOne(traveller);
        if (!newTraveller) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create traveller",
                error: true
            }
        }

        return {
            status: STATUS.CREATED,
            message: "Successfully",
            data: newTraveller,
        };
    },

    async updateById(id: string | undefined, traveller: Partial<ITraveller>): Promise<APIResponse<ITraveller>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true,
            };
        }

        const exist = await travellerModel.findById(id);
        if (!exist) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Traveller not found",
                error: true,
            };
        }

        const updated = await travellerModel.updateById(id, traveller);
        if (!updated) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update traveller",
                error: true
            }
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updated,
        };
    },

    async deleteById(id: string | undefined) {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true,
            };
        }
        const result = await travellerModel.deleteById(id);
        if (!result) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Failed to delete traveller",
                error: true,
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
        };
    },
};

export default travellerService;
