import { IRouteResponse } from "../dto/routeResponse";
import { ICost } from "../models/cost.model";
import { IRoute, routeModel } from "../models/route.model";
import { APIResponse, STATUS } from "../types/response";

const routeService = {
    async findAll(): Promise<APIResponse<Array<IRoute>>> {
        const routes = await routeModel.findAll();
        if (!routes) {
            return {
                status: STATUS.NOT_FOUND,
                message: "",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: routes
        }
    },

    async findById(id: string | undefined): Promise<APIResponse<IRoute>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            }
        }
        const route = await routeModel.findById(id);
        if (!route) {
            return {
                status: STATUS.NOT_FOUND,
                message: "id is not found",
                error: true
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: route
        }
    },

    async createOne(route: IRoute): Promise<APIResponse<IRoute>> {
        if (!route.trip_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "trip_id is null",
                error: true
            }
        }
        // check trip available
        // const trip = 
        route.created_at = new Date(Date.now());
        route.updated_at = new Date(Date.now());

        const newRoute = await routeModel.createOne(route);

        if (!newRoute) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create route",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newRoute
        }
    },

    async updateById(id: string | undefined, route: Partial<IRoute>): Promise<APIResponse<IRoute>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Id is undefined",
                error: true
            }
        }
        route.updated_at = new Date(Date.now());
        const updatedRoute = await routeModel.updateById(id, route);
        if (!updatedRoute) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update route",
                error: true
            }
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updatedRoute
        }
    },

    async deleteById(id: string | undefined): Promise<APIResponse<IRoute>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Id is undefined",
                error: true
            }
        }

        const result = await routeModel.deleteById(id);

        if (!result) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Route not found",
                error: true
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully"
        };
    },

    async findListCost(id: string | undefined): Promise<APIResponse<Array<ICost>>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Id is undefined",
                error: true
            }
        }
        const listCost = await routeModel.findListCost(id);
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: listCost
        }
    }
}

export default routeService;