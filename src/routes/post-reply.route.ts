import express, { Router } from "express";
import postReplyController from "../controllers/post-reply.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createLimiter } from "../middlewares/security.middleware";

const router: Router = express.Router();

router.get("/:id", postReplyController.getPostRepliesById);
router.post("/", authenticateToken, createLimiter, postReplyController.createPostReply);
router.patch("/:id", authenticateToken, postReplyController.updatePostReply);
router.delete("/:id", authenticateToken, postReplyController.deletePostReply);

export default router;