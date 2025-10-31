import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import pinRouter from './routes/pin.route.js';
import commentRoutes from './routes/comment.route.js';
import boardRouter from './routes/board.route.js';
import connectDB from './utils/connectDB.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(cookieParser());
app.use(fileUpload());

app.use("/users",userRouter);
app.use("/pins",pinRouter);
// 确保路由挂载正确
app.use("/comments", commentRoutes);
app.use("/boards",boardRouter);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
};

startServer();
