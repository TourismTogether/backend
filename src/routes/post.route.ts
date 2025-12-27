import express, { Router } from "express";
import postController from "../controllers/post.controller";

const router: Router = express.Router();

router.get("/", postController.getAllPosts);
router.get("/:id/post-replies", postController.getListPostReplies);
router.get("/:id", postController.getPostById);
router.post("/", postController.createPost);
router.patch("/:id", postController.updatePostById);
router.delete("/:id", postController.deletePostById);


export default router;