import { IPost, postModel } from "../models/post.model";
import { STATUS, APIResponse } from "../types/response";
import { userModel } from "../models/user.model"; // nếu có

const postService = {

    async findAll(): Promise<APIResponse<Array<IPost>>> {
        const posts = await postModel.findAll();
        if (!posts) {
            return {
                status: STATUS.NOT_FOUND,
                message: "",
                error: true
            }
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: posts
        }
    },

    async findById(id: string | undefined): Promise<APIResponse<IPost>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }
        const post = await postModel.findById(id);
        if (!post) {
            return {
                status: STATUS.NOT_FOUND,
                message: "post is not found",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: post
        }
    },

    async createOne(post: IPost): Promise<APIResponse<IPost>> {
        if (!post.user_id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "user_id is undefined",
                error: true
            };
        }

        const user = await userModel.findById(post.user_id);
        if (!user) {
            return {
                status: STATUS.NOT_FOUND,
                message: "user_id is not found",
                error: true
            };
        }

        post.created_at = new Date();
        post.updated_at = new Date();

        // default values (prevent undefined)
        if (!post.total_likes) post.total_likes = 0;
        if (!post.total_views) post.total_views = 0;

        const newPost = await postModel.createOne(post);

        if (!newPost) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to create post",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: newPost
        };
    },

    async updateById(id: string | undefined, post: IPost): Promise<APIResponse<IPost>> {

        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }

        post.updated_at = new Date();

        const updatedPost = await postModel.updateById(id, post);
        if (!updatedPost) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "Failed to update post",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully",
            data: updatedPost
        }
    },

    async deleteById(id: string | undefined): Promise<APIResponse<IPost>> {
        if (!id) {
            return {
                status: STATUS.BAD_REQUEST,
                message: "id is undefined",
                error: true
            };
        }

        const result = await postModel.deleteById(id);
        if (!result) {
            return {
                status: STATUS.INTERNAL_SERVER_ERROR,
                message: "failed to delete post",
                error: true
            };
        }
        return {
            status: STATUS.OK,
            message: "Successfully"
        };
    }
};

export default postService;
