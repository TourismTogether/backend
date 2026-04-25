import { error } from "console";
import { IUser, userModel } from "../models/user.model";
import { APIResponse, STATUS } from "../types/response";
import { ITrip } from "../models/trip.model";

const userSevice = {
    async findAll(): Promise<APIResponse<Array<IUser>>> {
        const users = await userModel.findAll();
        if (!users) {
            return {
                status: STATUS.NOT_FOUND,
                message: "",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: users
        };
    },

    async findAllPaginated(page: number, pageSize: number): Promise<APIResponse<{
        items: IUser[];
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
            userModel.findPaginated(safePageSize, offset),
            userModel.countAll(),
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

    async findById(id: string | undefined): Promise<APIResponse<IUser>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }
        const user = await userModel.findById(id);
        if (!user) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to find user",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: user
        };
    },


    async createOne(user: IUser) {
        user.created_at = new Date(Date.now());
        user.updated_at = new Date(Date.now());

        const newUser = await userModel.createOne(user);
        if (!newUser) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create user",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newUser
        };
    },


    async updateById(id: string | undefined, user: IUser): Promise<APIResponse<IUser>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }
        user.updated_at = new Date(Date.now());
        const updatedUser = await userModel.updateById(id, user);
        if (!updatedUser) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update user",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updatedUser
        };
    },

    async deleteById(id: string | undefined) {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }
        const result = userModel.deleteById(id);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to delete user",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully"
        }
    },

    async findListTrip(id: string | undefined): Promise<APIResponse<Array<ITrip>>> {
        if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
            return {
                status: STATUS.BAD_REQUEST,
                message: "User ID is required and must be a valid UUID",
                error: true
            };
        }
        // Validate UUID format (basic check)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Invalid User ID format. Expected UUID.",
                error: true
            };
        }
        const listTrip = await userModel.findListTrip(id);
        if (!listTrip) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to find"
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: listTrip
        }
    }
}

export default userSevice;