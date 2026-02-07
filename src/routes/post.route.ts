import express, { Router } from "express";
import postController from "../controllers/post.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createLimiter } from "../middlewares/security.middleware";

const router: Router = express.Router();

router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.get("/:id/post-replies", postController.getListPostReplies);
router.post("/", authenticateToken, createLimiter, postController.createPost);
router.patch("/:id", authenticateToken, postController.updatePostById);
router.delete("/:id", authenticateToken, postController.deletePostById);
router.post("/:id/like", authenticateToken, postController.toggleLike);
router.post("/replies", authenticateToken, createLimiter, postController.createReply);

export default router;
