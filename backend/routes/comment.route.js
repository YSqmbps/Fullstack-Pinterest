import express from 'express';
import { getPostComments, addComment, deleteComment } from '../controllers/comment.controller.js';
import  validateCommentInput  from '../middlewares/validateComment.js';
import  verifyToken  from '../middlewares/verifyToken.js';

const router = express.Router();    

// 获取帖子评论（支持分页）
router.get("/:postId", getPostComments);

// 添加评论/回复（需登录 + 内容验证）
router.post("/", verifyToken, validateCommentInput, addComment);

// 删除评论（需登录）
router.delete("/:id", verifyToken, deleteComment);

export default router;