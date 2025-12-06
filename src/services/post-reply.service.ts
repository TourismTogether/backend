import { APIResponse, STATUS } from "../types/response";
import { postReplyModel, IPostReply } from "../models/post-reply.model";
import { postModel } from "../models/post.model";
import { travellerModel } from "../models/traveller.model";
import { error } from "console";

const postReplyService = {
    async getByPostId(post_id: string | undefined): Promise<APIResponse<IPostReply[]>> {
        if (!post_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "post_id is require",
                error: true
            }
        }
        const replies = await postReplyModel.findByPostId(post_id);
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: replies
        };
    },

    async getById(id: string | undefined): Promise<APIResponse<IPostReply>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is require",
                error: true
            }
        }
        const reply = await postReplyModel.findById(id);
        if (!reply) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Reply not found",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Sucessfully",
            data: reply
        };
    },

    async create(reply: IPostReply): Promise<APIResponse<IPostReply>> {
        if (!reply.content) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "Content required",
                error: true
            };
        }
        const post = await postModel.findById(reply.post_id);
        if (!post) {
            return {
                status: STATUS.NOT_FOUND,
                message: "post_id is not found",
                error: true
            }
        }
        const user = await travellerModel.findById(reply.user_id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "user_id is not found",
                error: true
            }
        }

        const created = await postReplyModel.create(reply);
        return {
            status: STATUS.CREATED,
            message: "Reply created",
            data: created
        };
    },

    async update(id: string | undefined, payload: Partial<IPostReply>) {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is require",
                error: true
            }
        }
        const exist = await postReplyModel.findById(id);
        if (!exist) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Reply not found",
                error: true
            };
        }
        payload.updated_at = new Date(Date.now());
        const updated = await postReplyModel.update(id, payload);
        return {
            status: STATUS.OK,
            message: "Reply updated",
            data: updated
        };
    },

    async delete(id: string | undefined) {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is require",
                error: true
            }
        }
        const exist = await postReplyModel.findById(id);
        if (!exist) {
            return {
                status: STATUS.NOT_FOUND,
                message: "Reply not found",
                error: true
            };
        }
        await postReplyModel.delete(id);
        return {
            status: STATUS.OK,
            message: "Reply deleted"
        };
    }
};

export default postReplyService;
