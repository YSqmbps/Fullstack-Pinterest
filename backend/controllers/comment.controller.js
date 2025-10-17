import Comment from '../models/comment.model.js'

export const getPostComments = async (req,res) => {

    const {postId} = req.params

    const comments = await Comment.find({ pin: postId }).populate("user" ).sort({ createdAt: -1 })

    res.status(200).json(comments)
}