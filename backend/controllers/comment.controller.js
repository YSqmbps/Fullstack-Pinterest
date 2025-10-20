import Comment from "../models/comment.model.js";

// 1. 获取帖子评论（支持分页 + 嵌套回复）
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1; // 页码
    const limit = parseInt(req.query.limit) || 10; // 每页数量
    const skip = (page - 1) * limit;

    // 先查顶级评论（parentId为null）
    const totalComments = await Comment.countDocuments({ pin: postId, parentId: null });
    const topLevelComments = await Comment.find({ pin: postId, parentId: null })
      .populate("user", "username img")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 批量查询每个顶级评论的回复
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await Comment.find({ parentId: comment._id })
          .populate("user", "username img")
          .sort({ createdAt: 1 });
        return { ...comment.toObject(), replies };
      })
    );

    res.status(200).json({
      comments: commentsWithReplies,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. 添加评论/回复
export const addComment = async (req,res) => {
  try {
    const { description,pin,parentId } = req.body;
    const newComment =  new Comment({
      description,
      pin,
      user: req.userId,
      parentId
    })
    await newComment.save()
    // 返回带用户信息的评论
    const populatedComment = await Comment.findById(newComment._id)
      .populate("user", "username img")
      .populate("parentId");
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// 4. 删除评论
export const deleteComment = async (req,res) => {
  try {
    const { id } = req.params;

    // 验证评论是否存在
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "评论不存在" });

    // 删除评论（递归删除所有子评论）
    await Comment.deleteMany({ parentId: id }); // 删除所有子评论
    await Comment.findByIdAndDelete(id); // 删除顶级评论

    res.status(200).json({ message: "评论删除成功" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}