import express, { Router } from "express";
import postReplyController from "../controllers/post-reply.controller";

const router: Router = express.Router();

router.get("/:id", postReplyController.getPostRepliesById);
router.post("/", postReplyController.createPostReply);
router.patch("/:id", postReplyController.updatePostReply);
router.delete("/:id", postReplyController.deletePostReply);

export default router;