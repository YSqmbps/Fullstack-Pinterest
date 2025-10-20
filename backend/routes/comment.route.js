import express from 'express';
import { getPostComments, addComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();    

// 只保留一个正确的路由配置
router.get("/:postId", getPostComments);
router.post("/",verifyToken,addComment)

export default router;