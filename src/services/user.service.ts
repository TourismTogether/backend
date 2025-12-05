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
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
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