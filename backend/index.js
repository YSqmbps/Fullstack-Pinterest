import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import pinRouter from './routes/pin.route.js';
import commentRoutes from './routes/comment.route.js';
import boardRouter from './routes/board.route.js';
import connectDB from './utils/connectDB.js';


const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
}))


app.use("/users",userRouter);
app.use("/pins",pinRouter);
// 确保路由挂载正确
app.use("/api/comments", commentRoutes);
app.use("/boards",boardRouter);

app.listen(3000, () => {
  connectDB();
  console.log('Server is running on port 3000');
});


// 在调用评论API的地方，确保URL格式正确
const fetchComments = async (postId) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/comments/${postId}`);
        return res.data;
    } catch (error) {
        console.error('获取评论失败:', error);
    }
}