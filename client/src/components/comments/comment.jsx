import "./comments.css";
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
  // 评论编辑状态
  const [isEditing, setIsEditing] = useState(false);
  // 评论编辑文本
  const [editText, setEditText] = useState(comment.description);
  // 评论回复表单显示状态
  const [showReplyForm, setShowReplyForm] = useState(false);
  // 评论回复文本
  const [replyText, setReplyText] = useState("");
  // 判断当前用户是否是评论的作者
  const isOwner = currentUser?.id === comment.user._id;


  // 添加日志（临时调试用）
console.log("当前登录用户ID：", currentUser?._id);
console.log("评论作者ID：", comment.user?._id);
console.log("是否为作者：", isOwner);




  // 编辑评论mutation
  const updateMutation = useMutation({
    mutationFn: (data) => apiRequest.put(`/comments/${comment._id}`, data),
    onSuccess: () => {
      setIsEditing(false);
      // 编辑成功后，刷新评论列表
      queryClient.invalidateQueries(["comments", pinId]);
    },
  });

  // 删除评论mutation
  const deleteMutation = useMutation({
    mutationFn: () => apiRequest.delete(`/comments/${comment._id}`),
    onSuccess: () => {
      // 删除成功后，刷新评论列表
      queryClient.invalidateQueries(["comments", pinId]);
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

  const handleEdit = () => {
    updateMutation.mutate({ description: editText, pin: pinId });
  };

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

  return (
    <div className="comment">
      <Image src={comment.user.img || "/general/noAvatar.png"} alt="" />
      <div className="commentContent">
        <div className="commentHeader">
          <span className="commentUsername">{comment.user.username}</span>
          {/* 仅作者可见的操作按钮 */}
          {isOwner && (
            <div className="commentActions">
              <button
                onClick={() => setIsEditing(true)}
                disabled={updateMutation.isPending}
              >
                编辑
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                className="deleteButton"
                disabled={deleteMutation.isPending}
              >
                删除
              </button>
            </div>
          )}
        </div>

        {/* 评论内容（编辑状态切换） */}
        {isEditing ? (
          <div className="editComment">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              maxLength="200"
            />
            <button onClick={handleEdit} disabled={!editText.trim()}>
              保存
            </button>
            <button onClick={() => setIsEditing(false)}>取消</button>
          </div>
        ) : (
          <p className="commentText">{comment.description}</p>
        )}

        {/* 新增：时间和回复按钮的容器（关键调整） */}
        <div className="commentMeta">
          <span className="commentTime">{format(comment.createdAt)}</span>
          <button
            className="replyBtn"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            回复
          </button>
        </div>

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
    </div>
  );
};

export default Comment;
