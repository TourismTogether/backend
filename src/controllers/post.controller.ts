import { NextFunction, Request, Response } from "express";
import { postReplyModel } from "../models/post-reply.model";
import { postModel } from "../models/post.model";
import postReplyService from "../services/post-reply.service";
import postService from "../services/post.service";

class PostController {
    // GET - /posts
    async getAllPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await postService.findAll();
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /posts/:id
    async getPostById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await postService.findById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // GET - /posts/:id/post-replies
    async getListPostReplies(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id || id === "NaN" || id === "undefined" || id.trim() === "") {
                return res.status(400).json({
                    status: 400,
                    message: "Post ID is required and must be a valid UUID",
                    error: true,
                });
            }
            // Validate UUID format (basic check)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(id)) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid Post ID format. Expected UUID.",
                    error: true,
                });
            }
            const result = await postReplyService.getByPostId(id);
            return res.status(result.status).json(result);
        } catch (err: unknown) {
            console.error("Error in getListPostReplies:", err);
            next(err);
        }
    }

    // POST - /posts
    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ status: 401, message: "Unauthorized", error: true });
            }
            const post = { ...req.body, user_id: userId };
            const result = await postService.createOne(post);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /posts/:id
    async updatePostById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const post = req.body;
            const result = await postService.updateById(id, post);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /posts/:id
    async deletePostById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await postService.deleteById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /posts/:id/like
    async toggleLike(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.userId || req.body?.user_id;
            if (!id) {
                return res
                    .status(400)
                    .json({ status: 400, message: "Invalid post ID", error: true });
            }
            if (!userId) {
                return res.status(401).json({ status: 401, message: "Unauthorized", error: true });
            }
            const result = await postModel.toggleLike(id, userId);
            return res.status(200).json({ status: 200, data: result });
        } catch (err) {
            next(err);
        }
    }

    // POST - /posts/replies
    async createReply(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ status: 401, message: "Unauthorized", error: true });
            }
            const { post_id, content } = req.body;
            if (!post_id || !content?.trim()) {
                return res.status(400).json({
                    status: 400,
                    message: "post_id and content are required",
                    error: true,
                });
            }
            const result = await postReplyModel.create({
                post_id,
                user_id: userId,
                content: content.trim(),
            });
            return res.status(201).json({ status: 201, data: result });
        } catch (err) {
            next(err);
        }
    }
}

export default new PostController();
