import "./comment.css";
import Image from "../image/image.jsx";
import { format } from "timeago.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest.js";

const Comment = ({ comment, pinId }) => {
  // 评论作者
  const { user: currentUser } = useAuth();
  // 评论查询客户端
  const queryClient = useQueryClient();
  // 评论回复表单显示状态
  const [showReplyForm, setShowReplyForm] = useState(false);
  // 评论回复文本
  const [replyText, setReplyText] = useState("");
  // 删除确认弹窗状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // 判断用户是否登录（用于删除权限）
  const isLoggedIn = !!currentUser;

  // 删除评论mutation
  const deleteMutation = useMutation({
    mutationFn: () => apiRequest.delete(`/comments/${comment._id}`),
    onSuccess: () => {
      // 删除成功后，刷新评论列表
      queryClient.invalidateQueries(["comments", pinId]);
      // 关闭确认弹窗
      setShowDeleteConfirm(false);
    },
  });

  // 评论回复mutation
  const replyMutation = useMutation({
    mutationFn: (data) => apiRequest.post(`/comments`, data),
    onSuccess: () => {
      // 清空回复文本
      setReplyText("");
      // 隐藏回复表单
      setShowReplyForm(false);
      // 回复成功后，刷新评论列表
      queryClient.invalidateQueries(["comments", pinId]);
    },
  });

  const handleReply = () => {
    replyMutation.mutate({
      description: replyText,
      pin: pinId,
      parentId: comment._id,
    });
  };

  const handleCancelReply = () => {
    setReplyText("");
    setShowReplyForm(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="comment">
        {/* 添加comment.user存在检查 */}
        {comment.user ? (
            <>
                <Image src={comment.user.img || "/general/noAvatar.png"} alt="" />
                <div className="commentContent">
                    <div className="commentHeader">
                        <span className="commentUsername">{comment.user.username}</span>
                    </div>
                    
                    {/* 评论内容 */}
                    <p className="commentText">{comment.description}</p>
                    
                    {/* 剩余评论逻辑保持不变 */}
                    <div className="commentMeta">
                      <span className="commentTime">{format(comment.createdAt)}</span>
                      <div className="commentActions">
                        <button
                          className="replyBtn"
                          onClick={() => setShowReplyForm(!showReplyForm)}
                        >
                          回复
                        </button>
                        {/* 删除按钮对所有登录用户显示 */}
                        {isLoggedIn && (
                          <button
                            onClick={handleDeleteClick}
                            className="deleteButton"
                            disabled={deleteMutation.isPending}
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 删除确认弹窗 */}
                    {showDeleteConfirm && (
                      <div className="deleteConfirmModal">
                        <div className="deleteConfirmContent">
                          <p>确定要删除这条评论吗？</p>
                          <div className="deleteConfirmActions">
                            <button 
                              onClick={handleConfirmDelete}
                              disabled={deleteMutation.isPending}
                              className="confirmButton"
                            >
                              {deleteMutation.isPending ? "删除中..." : "确认删除"}
                            </button>
                            <button 
                              onClick={handleCancelDelete}
                              disabled={deleteMutation.isPending}
                              className="cancelButton"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 回复表单 */}
                    {showReplyForm && (
                      <div className="replyForm">
                        <input
                          type="text"
                          placeholder="写下你的回复..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          maxLength="200"
                        />
                        <button
                          onClick={handleReply}
                          disabled={!replyText.trim() || replyMutation.isPending}
                        >
                          发送
                        </button>
                        <button
                          onClick={handleCancelReply}
                          disabled={replyMutation.isPending}
                          className="replyCancelBtn"
                        >
                          取消
                        </button>
                      </div>
                    )}

                    {/* 渲染子回复 */}
                    {comment.replies?.length > 0 && (
                      <div className="replies">
                        {comment.replies.map((reply) => (
                          <Comment key={reply._id} comment={reply} pinId={pinId} />
                        ))}
                      </div>
                    )}
                </div>
            </>
        ) : (
            <div className="commentContent">
                <p className="commentText">{comment.description}</p>
                <span className="commentTime">{format(comment.createdAt)}</span>
            </div>
        )}
    </div>
)
};

export default Comment;