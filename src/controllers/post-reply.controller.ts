import { NextFunction, Request, Response } from "express";
import postReplyService from "../services/post-reply.service";

class PostReplyController {
    // GET - /post-replies/:id
    async getPostRepliesById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await postReplyService.getById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /post-replies
    async createPostReply(req: Request, res: Response, next: NextFunction) {
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
            const postReply = { ...req.body, user_id: userId, content: content.trim() };
            const result = await postReplyService.create(postReply);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // PATCH - /post-replies/:id
    async updatePostReply(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const postReply = req.body;
            const result = await postReplyService.update(id, postReply);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // DELETE - /post-replies/:id
    async deletePostReply(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await postReplyService.delete(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }
}

export default new PostReplyController();
