import { Request, Response, NextFunction } from "express"
import postService from "../services/post.service";
import postReplyService from "../services/post-reply.service";

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
            if (!id) {
                return res.status(400).json({
                    status: 400,
                    message: "Post ID is required",
                    error: true
                });
            }
            const result = await postReplyService.getByPostId(id);
            return res.status(result.status).json(result);
        } catch (err: any) {
            console.error("Error in getListPostReplies:", err);
            next(err);
        }
    }

    // POST - /posts
    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const post = req.body;
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
}

export default new PostController();