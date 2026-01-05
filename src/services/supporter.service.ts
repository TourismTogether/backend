import { supporterModel, ISupporter } from "../models/supporter.model";
import { userModel } from "../models/user.model";
import { APIResponse, STATUS } from "../types/response";

const supporterService = {
    async findAll(): Promise<APIResponse<ISupporter[]>> {
        const data = await supporterModel.findAll();
        return {
            status: STATUS.OK,
            message: "Successfully",
            data
        };
    },

    async findById(userId: string | undefined): Promise<APIResponse<ISupporter>> {
        if (!userId) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is undefined",
                error: true
            };
        }

        const data = await supporterModel.findById(userId);
        if (!data) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Supporter not found",
                error: true
            };
        }

        return {
            status: STATUS.OK,
            message: "Successfully",
            data
        };
    },

    async createOne(s: ISupporter): Promise<APIResponse<ISupporter>> {
        if (!s.user_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is required",
                error: true
            };
        }
        const user = await userModel.findById(s.user_id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Not found user_id",
                error: true
            }
        }


        const created = await supporterModel.createOne(s);
        if (!created) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create supporter",
                error: true
            }
        }

        return {
            status: STATUS.CREATED,
            message: "Supporter created",
            data: created
        };
    },

    async updateById(id: string | undefined, s: Partial<ISupporter>): Promise<APIResponse<ISupporter>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is required",
                error: true
            };
        }
        const exist = await supporterModel.findById(id);
        if (!exist) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Supporter not found",
                error: true
            };
        }

        const updated = await supporterModel.updateById(id, s);
        if (!updated) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update supporter",
                error: true
            }
        }

        return {
            status: STATUS.OK,
            message: "Supporter updated",
            data: updated
        };
    },

    async deleteById(id: string | undefined): Promise<APIResponse<any>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is required",
                error: true
            };
        }
        const exist = await supporterModel.findById(id);
        if (!exist) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Supporter not found",
                error: true
            };
        }

        await supporterModel.delete(id);

        return {
            status: STATUS.OK,
            message: "Supporter deleted"
        };
    },

    async findAllWithUserInfo(): Promise<APIResponse<Array<ISupporter & { user_full_name?: string; user_phone?: string; user_avatar_url?: string }>>> {
        const data = await supporterModel.findAllWithUserInfo();
        return {
            status: STATUS.OK,
            message: "Successfully",
            data
        };
    }
};

export default supporterService;
