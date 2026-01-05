import { IRegion, regionModel } from "../models/region.model";
import { STATUS, APIResponse } from "../types/response";

const regionService = {

    async findAll(): Promise<APIResponse<Array<IRegion>>> {
        const regions = await regionModel.findAll();
        if (!regions) {
            return {
                status: STATUS.NOT_FOUND,
                message: "",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: regions
        }
    },

    async findById(id: string | undefined): Promise<APIResponse<IRegion>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }
        const region = await regionModel.findById(id);
        if (!region) {
            return {
                status: STATUS.NOT_FOUND,
                message: "region is not found",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: region
        }
    },

    async createOne(region: IRegion): Promise<APIResponse<IRegion>> {
        if (!region.address) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "address is required",
                error: true
            };
        }

        region.created_at = new Date();
        region.updated_at = new Date();

        const newRegion = await regionModel.createOne(region);

        if (!newRegion) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create region",
                error: true
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newRegion
        };
    },

    async updateById(id: string | undefined, region: IRegion): Promise<APIResponse<IRegion>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }

        region.updated_at = new Date();

        const updatedRegion = await regionModel.updateById(id, region);
        if (!updatedRegion) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update region",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updatedRegion
        }
    },

    async deleteById(id: string | undefined): Promise<APIResponse<IRegion>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }

        // Check if region is being used by destinations
        const destinationCount = await regionModel.countDestinationsByRegionId(id);
        if (destinationCount > 0) {
            return {
                status: STATUS.BAD_REQUEST,
                message: `Cannot delete region. It is being used by ${destinationCount} destination(s). Please remove or update those destinations first.`,
                error: true
            };
        }

        try {
            const result = await regionModel.deleteById(id);
            if (!result) {
                return {
                    status: STATUS.INTERNAL_SERVER_ERROR,
                    message: "failed to delete region",
                    error: true
                };
            }
            return {
                status: STATUS.OK,
                message: "Successfully"
            };
        } catch (err: any) {
            // Handle foreign key constraint error
            if (err.code === '23503' || err.message?.includes('foreign key constraint')) {
                return {
                    status: STATUS.BAD_REQUEST,
                    message: "Cannot delete region. It is being used by one or more destinations. Please remove or update those destinations first.",
                    error: true
                };
            }
            throw err;
        }
    }

};

export default regionService;
