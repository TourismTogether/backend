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

    async findById(id: string | undefined): Promise<APIResponse<IDestination>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
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
