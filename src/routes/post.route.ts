import express, { Router } from "express";
import postController from "../controllers/post.controller";

const router: Router = express.Router();

router.get("/", postController.getAllPosts);
router.post("/", postController.createPost);
router.get("/:id", postController.getPostById);
router.patch("/:id", postController.updatePostById);
router.delete("/:id", postController.deletePostById);
router.post("/:id/like", postController.toggleLike);
router.post("/replies", postController.createReply);
router.post("/post-replies", postController.createReply);
router.get("/:id/post-replies", postController.getListPostReplies);

export default router;
