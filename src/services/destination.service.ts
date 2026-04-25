import { IDestination, destinationModel } from "../models/destination.model";
import { APIResponse, STATUS } from "../types/response";
import { regionModel } from "../models/region.model";

const destinationService = {

    async findAll(): Promise<APIResponse<Array<IDestination>>> {
        const destinations = await destinationModel.findAll();
        if (!destinations) {
            return {
                status: STATUS.NOT_FOUND,
                message: "",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: destinations
        }
    },

    async findAllPaginated(page: number, pageSize: number): Promise<APIResponse<{
        items: IDestination[];
        pagination: {
            page: number;
            pageSize: number;
            total: number;
            totalPages: number;
        };
    }>> {
        const safePage = Math.max(1, Number(page) || 1);
        const safePageSize = Math.min(100, Math.max(1, Number(pageSize) || 10));
        const offset = (safePage - 1) * safePageSize;

        const [items, total] = await Promise.all([
            destinationModel.findPaginated(safePageSize, offset),
            destinationModel.countAll(),
        ]);

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: {
                items,
                pagination: {
                    page: safePage,
                    pageSize: safePageSize,
                    total,
                    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
                },
            },
        };
    },

    async findById(id: string | undefined): Promise<APIResponse<IDestination>> {
        if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Destination ID is required and must be a valid UUID",
                error: true
            };
        }
        // Validate UUID format (basic check)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Invalid Destination ID format. Expected UUID.",
                error: true
            };
        }
        const destination = await destinationModel.findById(id);
        if (!destination) {
            return {
                status: STATUS.NOT_FOUND,
                message: "destination is not found",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: destination
        }
    },

    async createOne(destination: IDestination): Promise<APIResponse<IDestination>> {

        if (!destination.region_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "region_id is undefined",
                error: true
            };
        }

        const region = await regionModel.findById(destination.region_id);
        if (!region) {
            return {
                status: STATUS.NOT_FOUND,
                message: "region_id is not found",
                error: true
            };
        }

        destination.created_at = new Date();
        destination.updated_at = new Date();

        const newDestination = await destinationModel.createOne(destination);

        if (!newDestination) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create destination",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newDestination
        };
    },

    async updateById(id: string | undefined, destination: IDestination): Promise<APIResponse<IDestination>> {

        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }

        if (!destination.region_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "region_id is undefined",
                error: true
            }
        }

        const region = await regionModel.findById(destination.region_id);
        if (!region) {
            return {
                status: STATUS.NOT_FOUND,
                message: "region_id is not found",
                error: true
            };
        }

        destination.updated_at = new Date();

        const updatedDestination = await destinationModel.updateById(id, destination);
        if (!updatedDestination) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update destination",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updatedDestination
        }
    },

    async deleteById(id: string | undefined): Promise<APIResponse<IDestination>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }

        const result = await destinationModel.deleteById(id);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "failed to delete destination",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully"
        };
    }

};

export default destinationService;
