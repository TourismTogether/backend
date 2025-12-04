import { error } from "console";
import { costModel, ICost } from "../models/cost.model";
import { APIResponse, STATUS } from "../types/response";
import { routeModel } from "../models/route.model";


const costService = {
    async findAll(): Promise<APIResponse<Array<ICost>>> {
        const costs = await costModel.findAll();
        if (!costs) {
            return {
                status: STATUS.NOT_FOUND,
                message: "",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: costs
        }
    },

    async findById(id: string | undefined): Promise<APIResponse<ICost>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }
        const cost = await costModel.findById(id);
        if (!cost) {
            return {
                status: STATUS.NOT_FOUND,
                message: "cost is not found",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: cost
        }
    },

    async createOne(cost: ICost): Promise<APIResponse<ICost>> {
        if (!cost.route_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "route_id is undefined",
                error: true
            };
        }
        const route = await routeModel.findById(cost.route_id);
        if (!route) {
            return {
                status: STATUS.NOT_FOUND,
                message: "route_id is not found",
                error: true
            };
        }

        cost.created_at = new Date(Date.now());
        cost.updated_at = new Date(Date.now());

        const newCost = await costModel.createOne(cost);

        if (!newCost) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create cost",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newCost
        };
    },

    async updateById(id: string | undefined, cost: ICost): Promise<APIResponse<ICost>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }
        if (!cost.route_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "route_id is undefined",
                error: true
            }
        }
        const route = await routeModel.findById(cost.route_id);
        if (!route) {
            return {
                status: STATUS.NOT_FOUND,
                message: "route_id is not found",
                error: true
            };
        }
        const updatedCost = await costModel.updateById(id, cost);
        if (!updatedCost) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update cost",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updatedCost
        }
    },

    async deleteById(id: string | undefined): Promise<APIResponse<ICost>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }

        const result = await costModel.deleteById(id);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "failed to delete cost",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully"
        };
    }
};

export default costService;