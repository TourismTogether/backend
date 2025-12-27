import { Request, Response, NextFunction } from "express";
import postReplyService from "../services/post-reply.service";

class PostReplyController {
    // GET - /post-replies/:id
    async getPostRepliesById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const result = await postReplyService.getById(id);
            return res.status(result.status).json(result);
        } catch (err) {
            next(err);
        }
    }

    // POST - /post-replies
    async createPostReply(req: Request, res: Response, next: NextFunction) {
        try {
            const postReply = req.body;
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