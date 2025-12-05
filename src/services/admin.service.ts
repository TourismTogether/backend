import { error } from "console";
import { IAdmin, adminModel } from "../models/admin.model";
import { userModel } from "../models/user.model";
import { APIResponse, STATUS } from "../types/response";

const adminService = {
    async findAll(): Promise<APIResponse<Array<IAdmin>>> {
        const data = await adminModel.findAll();
        if (!data) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Failed to find",
                error: true
            }
        }
        return { status: STATUS.OK, message: "Successfully", data };
    },

    async createOne(admin: IAdmin) {
        if (!admin.user_id || !admin.key) {
            return { status: STATUS.BAD_REQUEST, message: "user_id and key required", error: true };
        }

        const user = await userModel.findById(admin.user_id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Not found user_id",
                error: true
            }
        }

        const data = await adminModel.createOne(admin);
        return { status: STATUS.CREATED, message: "Successfully", data };
    },

    async findById(id: string | undefined) {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is undefined",
                error: true
            }
        }
        const data = await adminModel.findById(id);
        if (!data) {
            return { status: STATUS.NOT_FOUND, message: "Admin not found", error: true };
        }
        return { status: STATUS.OK, data };
    },

    async updateById(id: string | undefined, admin: Partial<IAdmin>) {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is undefined",
                error: true
            }
        }
        const exist = await adminModel.findById(id);
        if (!exist) {
            return { status: STATUS.NOT_FOUND, message: "Admin not found", error: true };
        }
        const updated = await adminModel.updateById(id, admin);
        return { status: STATUS.OK, message: "Successfully", data: updated };
    },

    async deleteById(id: string | undefined) {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is undefined",
                error: true
            }
        }
        const exist = await adminModel.findById(id);
        if (!exist) {
            return { status: STATUS.NOT_FOUND, message: "Admin not found", error: true };
        }
        await adminModel.delete(id);
        return { status: STATUS.OK, message: "Successfully" };
    }
};

export { adminService };
