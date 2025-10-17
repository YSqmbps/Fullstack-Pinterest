import express from 'express';
import { getPostComments } from '../controllers/comment.controller.js';

const router = express.Router();    

// 添加获取评论的路由
router.get("/:postId", getPostComments);

export default router;